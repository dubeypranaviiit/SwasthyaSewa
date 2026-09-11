import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getRedisClient, isRedisReady } from "../config/redis.js";

const rateLimitHandler = (req, res) => {
    console.warn(
        `[RateLimit] 429 | ${req.method} ${req.originalUrl} | IP: ${req.ip}` +
        (req.body?.userId ? ` | user: ${req.body.userId}` : "")
    );
    res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
    });
};

class InMemoryFallbackStore {
    constructor(windowMs, maxRequests) {
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
        this.hits = new Map();
        this.maxEntries = 10000;
        this._cleanupInterval = setInterval(() => this._cleanup(), 60000);
        if (this._cleanupInterval.unref) this._cleanupInterval.unref();
    }

    isRateLimited(key) {
        const now = Date.now();
        const entry = this.hits.get(key);
        if (!entry || now - entry.startTime > this.windowMs) {
            if (this.hits.size >= this.maxEntries && !this.hits.has(key)) {
                const oldestKey = this.hits.keys().next().value;
                this.hits.delete(oldestKey);
            }
            this.hits.set(key, { count: 1, startTime: now });
            return false;
        }
        entry.count++;
        return entry.count > this.maxRequests;
    }

    _cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.hits) {
            if (now - entry.startTime > this.windowMs) this.hits.delete(key);
        }
    }
}

const authFallback = new InMemoryFallbackStore(15 * 60 * 1000, 10);
const otpSendIpFallback = new InMemoryFallbackStore(10 * 60 * 1000, 3);
const otpSendEmailFallback = new InMemoryFallbackStore(10 * 60 * 1000, 3);
const otpVerifyIpFallback = new InMemoryFallbackStore(10 * 60 * 1000, 5);
const otpVerifyEmailFallback = new InMemoryFallbackStore(10 * 60 * 1000, 5);

const createRedisStore = (prefix) => {
    const client = getRedisClient();
    if (!client) return undefined;
    return new RedisStore({
        sendCommand: (...args) => client.sendCommand(args),
        prefix: `swasthya_rl:${prefix}:`,
    });
};

const failClosedMiddleware = (fallbackStore, keyGenerator) => {
    return (req, res, next) => {
        if (!isRedisReady()) {
            const key = keyGenerator(req);
            if (fallbackStore.isRateLimited(key)) {
                console.warn(
                    `[RateLimit] 429 (fallback) | ${req.method} ${req.originalUrl} | IP: ${req.ip}`
                );
                return res.status(429).json({
                    success: false,
                    message: "Too many requests. Please try again later.",
                });
            }
        }
        next();
    };
};

const normalizeEmail = (email) => {
    if (!email || typeof email !== "string") return "unknown";
    return email.trim().toLowerCase();
};

const safeIpKey = (req) => ipKeyGenerator(req.ip);

const noopMiddleware = (req, res, next) => next();

let globalLimiter = noopMiddleware;
let authLimiter = [noopMiddleware];
let otpSendLimiterByIp = [noopMiddleware];
let otpSendLimiterByEmail = [noopMiddleware];
let otpVerifyLimiterByIp = [noopMiddleware];
let otpVerifyLimiterByEmail = [noopMiddleware];
let appointmentLimiter = noopMiddleware;
let cancellationLimiter = noopMiddleware;
let paymentLimiter = noopMiddleware;
let expensiveLimiter = noopMiddleware;

const initRateLimiters = () => {
    const redisAvailable = isRedisReady();
    console.log(
        `[RateLimit] Initializing limiters (Redis: ${redisAvailable ? "connected" : "unavailable"})`
    );

    globalLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("global") : undefined,
        keyGenerator: safeIpKey,
        skip: (req) => req.method === "OPTIONS",
    });

    const authLimiterRedis = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("auth") : undefined,
        keyGenerator: safeIpKey,
        skip: (req) => req.method === "OPTIONS",
    });
    const authFailClosed = failClosedMiddleware(authFallback, (req) => `auth:${safeIpKey(req)}`);
    authLimiter = [authFailClosed, authLimiterRedis];

    const otpSendByIpRedis = rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 3,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("otp_send_ip") : undefined,
        keyGenerator: safeIpKey,
        skip: (req) => req.method === "OPTIONS",
    });
    const otpSendByEmailRedis = rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 3,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("otp_send_email") : undefined,
        keyGenerator: (req) => `email:${normalizeEmail(req.body?.email)}`,
        skip: (req) => req.method === "OPTIONS",
        validate: { keyGeneratorIpFallback: false },
    });
    const otpSendIpFC = failClosedMiddleware(otpSendIpFallback, (req) => `otp_send_ip:${safeIpKey(req)}`);
    const otpSendEmailFC = failClosedMiddleware(
        otpSendEmailFallback,
        (req) => `otp_send_email:${normalizeEmail(req.body?.email)}`
    );
    otpSendLimiterByIp = [otpSendIpFC, otpSendByIpRedis];
    otpSendLimiterByEmail = [otpSendEmailFC, otpSendByEmailRedis];

    const otpVerifyByIpRedis = rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 5,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("otp_verify_ip") : undefined,
        keyGenerator: safeIpKey,
        skip: (req) => req.method === "OPTIONS",
    });
    const otpVerifyByEmailRedis = rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 5,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("otp_verify_email") : undefined,
        keyGenerator: (req) => `email:${normalizeEmail(req.body?.email)}`,
        skip: (req) => req.method === "OPTIONS",
        validate: { keyGeneratorIpFallback: false },
    });
    const otpVerifyIpFC = failClosedMiddleware(otpVerifyIpFallback, (req) => `otp_verify_ip:${safeIpKey(req)}`);
    const otpVerifyEmailFC = failClosedMiddleware(
        otpVerifyEmailFallback,
        (req) => `otp_verify_email:${normalizeEmail(req.body?.email)}`
    );
    otpVerifyLimiterByIp = [otpVerifyIpFC, otpVerifyByIpRedis];
    otpVerifyLimiterByEmail = [otpVerifyEmailFC, otpVerifyByEmailRedis];

    appointmentLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("appointment") : undefined,
        keyGenerator: (req) => `user:${req.body?.userId || safeIpKey(req)}`,
        skip: (req) => req.method === "OPTIONS",
        validate: { keyGeneratorIpFallback: false },
    });

    cancellationLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("cancel") : undefined,
        keyGenerator: (req) => `user:${req.body?.userId || safeIpKey(req)}`,
        skip: (req) => req.method === "OPTIONS",
        validate: { keyGeneratorIpFallback: false },
    });

    paymentLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("payment") : undefined,
        keyGenerator: (req) => `user:${req.body?.userId || safeIpKey(req)}`,
        skip: (req) => req.method === "OPTIONS",
        validate: { keyGeneratorIpFallback: false },
    });

    expensiveLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 30,
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: redisAvailable ? createRedisStore("expensive") : undefined,
        keyGenerator: safeIpKey,
        skip: (req) => req.method === "OPTIONS",
    });

    console.log("[RateLimit] All limiters initialized successfully.");
};

const globalLimiterMw = (req, res, next) => globalLimiter(req, res, next);

const authLimiterMw = (req, res, next) => {
    let idx = 0;
    const runNext = (err) => {
        if (err) return next(err);
        if (idx >= authLimiter.length) return next();
        const mw = authLimiter[idx++];
        mw(req, res, runNext);
    };
    runNext();
};

const otpSendLimiterByIpMw = (req, res, next) => {
    let idx = 0;
    const runNext = (err) => {
        if (err) return next(err);
        if (idx >= otpSendLimiterByIp.length) return next();
        const mw = otpSendLimiterByIp[idx++];
        mw(req, res, runNext);
    };
    runNext();
};

const otpSendLimiterByEmailMw = (req, res, next) => {
    let idx = 0;
    const runNext = (err) => {
        if (err) return next(err);
        if (idx >= otpSendLimiterByEmail.length) return next();
        const mw = otpSendLimiterByEmail[idx++];
        mw(req, res, runNext);
    };
    runNext();
};

const otpVerifyLimiterByIpMw = (req, res, next) => {
    let idx = 0;
    const runNext = (err) => {
        if (err) return next(err);
        if (idx >= otpVerifyLimiterByIp.length) return next();
        const mw = otpVerifyLimiterByIp[idx++];
        mw(req, res, runNext);
    };
    runNext();
};

const otpVerifyLimiterByEmailMw = (req, res, next) => {
    let idx = 0;
    const runNext = (err) => {
        if (err) return next(err);
        if (idx >= otpVerifyLimiterByEmail.length) return next();
        const mw = otpVerifyLimiterByEmail[idx++];
        mw(req, res, runNext);
    };
    runNext();
};

const appointmentLimiterMw = (req, res, next) => appointmentLimiter(req, res, next);
const cancellationLimiterMw = (req, res, next) => cancellationLimiter(req, res, next);
const paymentLimiterMw = (req, res, next) => paymentLimiter(req, res, next);
const expensiveLimiterMw = (req, res, next) => expensiveLimiter(req, res, next);

export {
    initRateLimiters,
    globalLimiterMw as globalLimiter,
    authLimiterMw as authLimiter,
    otpSendLimiterByIpMw as otpSendLimiterByIp,
    otpSendLimiterByEmailMw as otpSendLimiterByEmail,
    otpVerifyLimiterByIpMw as otpVerifyLimiterByIp,
    otpVerifyLimiterByEmailMw as otpVerifyLimiterByEmail,
    appointmentLimiterMw as appointmentLimiter,
    cancellationLimiterMw as cancellationLimiter,
    paymentLimiterMw as paymentLimiter,
    expensiveLimiterMw as expensiveLimiter,
};
