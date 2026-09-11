/**
 * Rate Limiting Test Script for SwasthyaSewa
 *
 * Tests all rate limiters against a running backend instance.
 * Run with: node scratch/testRateLimiting.js
 *
 * Prerequisites:
 *   - Backend running on http://localhost:5000
 *   - Redis connected (check server logs for "[Redis] Connected and ready")
 *
 * IMPORTANT: This script tests against the live backend.
 * It will consume rate-limit quota. Restart the backend or flush Redis
 * between test runs: redis-cli -u $REDIS_URL FLUSHDB
 */

const BASE_URL = process.env.TEST_URL || "http://localhost:5000";

// ==========================================
// Helper: Make HTTP request
// ==========================================
async function request(method, path, body = null, headers = {}) {
    const url = `${BASE_URL}${path}`;
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    return {
        status: res.status,
        data,
        headers: Object.fromEntries(res.headers),
    };
}

// ==========================================
// Helper: Send N requests and track results
// ==========================================
async function sendRequests(method, path, body, count, headers = {}) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const res = await request(method, path, body, headers);
        results.push(res);
    }
    return results;
}

// ==========================================
// Test utilities
// ==========================================
let passed = 0;
let failed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`  ✅ ${testName}`);
        passed++;
    } else {
        console.log(`  ❌ ${testName}`);
        failed++;
    }
}

// ==========================================
// TEST SUITES
// ==========================================

async function testHealthEndpoint() {
    console.log("\n🔍 Test: Health endpoint (not rate-limited)");
    const res = await request("GET", "/health");
    assert(res.status === 200, "Health returns 200");
    assert(res.data.status === "healthy", "Health returns healthy status");
}

async function testRateLimitHeaders() {
    console.log("\n🔍 Test: Rate-limit headers present");
    const res = await request("GET", "/api/doctor/list");
    assert(res.status === 200, "Doctor list returns 200");
    assert(
        res.headers["ratelimit-limit"] !== undefined,
        "RateLimit-Limit header present"
    );
    assert(
        res.headers["ratelimit-remaining"] !== undefined,
        "RateLimit-Remaining header present"
    );
    assert(
        res.headers["ratelimit-reset"] !== undefined,
        "RateLimit-Reset header present"
    );
}

async function testAuthLimiter() {
    console.log("\n🔍 Test: Auth limiter (10 req / 15 min)");
    console.log("  Sending 12 login requests...");

    const results = await sendRequests(
        "POST",
        "/api/user/login",
        { email: "ratelimit-test@example.com", password: "wrongpassword123" },
        12
    );

    const successCount = results.filter((r) => r.status !== 429).length;
    const blockedCount = results.filter((r) => r.status === 429).length;

    assert(successCount <= 10, `At most 10 requests succeed (got ${successCount})`);
    assert(blockedCount >= 2, `At least 2 requests blocked with 429 (got ${blockedCount})`);

    // Verify 429 response format
    const blocked = results.find((r) => r.status === 429);
    if (blocked) {
        assert(blocked.data.success === false, "429 response has success: false");
        assert(
            blocked.data.message === "Too many requests. Please try again later.",
            "429 response has correct message"
        );
    }
}

async function testOtpSendLimiter() {
    console.log("\n🔍 Test: OTP send limiter (3 req / 10 min per email)");
    console.log("  Sending 5 OTP requests for same email...");

    const results = await sendRequests(
        "POST",
        "/api/user/send-otp",
        { email: "otp-test-victim@example.com" },
        5
    );

    const blockedCount = results.filter((r) => r.status === 429).length;
    assert(
        blockedCount >= 2,
        `At least 2 requests blocked with 429 for same email (got ${blockedCount})`
    );
}

async function testOtpDifferentEmailsSameIp() {
    console.log("\n🔍 Test: OTP IP limiter (same IP, different emails)");
    console.log("  Sending OTP for 5 different emails from same IP...");

    const results = [];
    for (let i = 0; i < 5; i++) {
        const res = await request("POST", "/api/user/send-otp", {
            email: `otp-ip-test-${i}@example.com`,
        });
        results.push(res);
    }

    const blockedCount = results.filter((r) => r.status === 429).length;
    assert(
        blockedCount >= 2,
        `IP limiter blocks after 3 even with different emails (blocked ${blockedCount})`
    );
}

async function testOtpVerifyLimiter() {
    console.log("\n🔍 Test: OTP verify limiter (5 req / 10 min)");
    console.log("  Sending 7 OTP verification requests...");

    const results = await sendRequests(
        "POST",
        "/api/user/verify-otp-signup",
        {
            name: "Test",
            email: "verify-test@example.com",
            password: "testpassword123",
            otp: "000000",
        },
        7
    );

    const blockedCount = results.filter((r) => r.status === 429).length;
    assert(
        blockedCount >= 2,
        `At least 2 requests blocked with 429 (got ${blockedCount})`
    );
}

async function testSpoofedForwardedFor() {
    console.log("\n🔍 Test: Spoofed X-Forwarded-For header");
    console.log(
        "  Sending requests with fake X-Forwarded-For should NOT bypass limiter"
    );

    // Exhaust the auth limit using simulated Render proxy header (client IP: 127.0.0.1)
    await sendRequests(
        "POST",
        "/api/doctor/login",
        { email: "spoof-test@example.com", password: "wrongpass123" },
        11,
        { "X-Forwarded-For": "127.0.0.1" }
    );

    // Simulate attacker attempting to spoof their IP by sending 'X-Forwarded-For: 99.99.99.99'.
    // Render proxy receives it from client (127.0.0.1) and appends the real IP:
    // '99.99.99.99, 127.0.0.1'. With trust proxy = 1, Express reads the trusted hop
    // (127.0.0.1) which is already rate-limited, ignoring the spoofed 99.99.99.99.
    const res = await request(
        "POST",
        "/api/doctor/login",
        { email: "spoof-test@example.com", password: "wrongpass123" },
        { "X-Forwarded-For": "99.99.99.99, 127.0.0.1" }
    );

    assert(
        res.status === 429,
        "Spoofed X-Forwarded-For with proxy hop does NOT bypass rate limit (status: " +
            res.status +
            ")"
    );
}

async function testSpoofedHeaders() {
    console.log("\n🔍 Test: Spoofed identity headers have no effect");

    // Send request with spoofed X-User-ID — should use IP not this header
    const res = await request(
        "POST",
        "/api/user/login",
        { email: "header-test@example.com", password: "wrongpass123" },
        { "X-User-ID": "fake-admin-id", "X-Email": "admin@swasthyasewa.com" }
    );

    // The request should be processed normally (using IP as key, not spoofed headers)
    assert(
        res.status !== 500,
        "Spoofed X-User-ID / X-Email headers don't cause errors"
    );
}

async function test429ResponseFormat() {
    console.log("\n🔍 Test: 429 response format consistency");

    // Exhaust admin login limiter
    const results = await sendRequests(
        "POST",
        "/api/admin/login",
        { email: "admin-test@example.com", password: "wrongpass123" },
        12
    );

    const blocked = results.find((r) => r.status === 429);
    if (blocked) {
        assert(blocked.data.success === false, "429 has success: false");
        assert(
            typeof blocked.data.message === "string",
            "429 has string message"
        );
        assert(
            !JSON.stringify(blocked.data).includes("redis"),
            "429 does not expose Redis info"
        );
        assert(
            !JSON.stringify(blocked.data).includes("REDIS_URL"),
            "429 does not expose REDIS_URL"
        );
    } else {
        console.log("  ⚠️  Could not trigger 429 on admin login");
    }
}

// ==========================================
// RUN ALL TESTS
// ==========================================
async function runTests() {
    console.log("=".repeat(60));
    console.log("SwasthyaSewa Rate Limiting Test Suite");
    console.log(`Target: ${BASE_URL}`);
    console.log("=".repeat(60));

    try {
        await testHealthEndpoint();
        await testRateLimitHeaders();
        await testAuthLimiter();
        await testOtpSendLimiter();
        await testOtpDifferentEmailsSameIp();
        await testOtpVerifyLimiter();
        await testSpoofedForwardedFor();
        await testSpoofedHeaders();
        await test429ResponseFormat();
    } catch (err) {
        console.error("\n💥 Test runner error:", err.message);
        console.error(
            "   Make sure the backend is running on",
            BASE_URL
        );
    }

    console.log("\n" + "=".repeat(60));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log("=".repeat(60));

    console.log("\n📋 Manual tests to perform:");
    console.log("  1. Same email from different IPs: Use a VPN or different device");
    console.log("     → Email limiter should still block after 3 OTP sends");
    console.log("  2. Authenticated user A vs B: Book appointments with 2 users");
    console.log("     → Each user gets their own 10-request limit");
    console.log("  3. Redis unavailable: Stop Redis and test login/OTP");
    console.log("     → Should fail-closed with in-memory fallback");
    console.log("  4. Multiple instances: Scale Render to 2+ instances");
    console.log("     → redis-cli KEYS 'swasthya_rl:*' shows shared counters");

    process.exit(failed > 0 ? 1 : 0);
}

runTests();
