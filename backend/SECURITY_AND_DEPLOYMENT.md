# Security & Deployment Guide — SwasthyaSewa Rate Limiting

## Architecture Overview

```
Client (Browser/Mobile)
        ↓
   Render (Reverse Proxy)
        ↓
   Node.js + Express
        ↓
   Redis Cloud  ← Distributed rate-limit counters
        ↓
   MongoDB Atlas / Cloudinary / Razorpay / Stream.io
```

---

## Why Redis for Rate Limiting?

### Problem: In-Memory Rate Limiting Fails at Scale

When using Express's default in-memory rate-limit store:
- Each backend instance maintains its **own separate counter**
- If Render runs 3 instances, an attacker gets `3 × limit` effective requests
- Counters are lost on every deploy/restart

### Solution: Redis as Shared Counter Store

Redis Cloud provides:
- **Shared counters** across all backend instances
- **Automatic TTL expiry** — rate-limit windows expire without manual cleanup
- **Atomic operations** — no race conditions when incrementing counters
- **Persistence** — counters survive individual instance restarts

### How Redis TTL Works

Each rate-limit key in Redis has a TTL (Time To Live) equal to the rate-limit window:
- `swasthya_rl:global:192.168.1.1` → TTL: 15 minutes
- `swasthya_rl:otp_send_email:email:user@example.com` → TTL: 10 minutes

When the TTL expires, Redis automatically deletes the key. The next request starts a fresh counter. This means:
- No manual cleanup needed
- No counter accumulation over time
- Windows are sliding (per express-rate-limit v7+ behavior)

---

## Rate Limit Configuration

| Limiter | Limit | Window | Key Strategy | Fail Strategy |
|---------|-------|--------|-------------|---------------|
| Global | 100 req | 15 min | IP | Fail-open |
| Auth (Login/Signup) | 10 req | 15 min | IP | Fail-closed + fallback |
| OTP Send (IP) | 3 req | 10 min | IP | Fail-closed + fallback |
| OTP Send (Email) | 3 req | 10 min | Normalized email | Fail-closed + fallback |
| OTP Verify (IP) | 5 req | 10 min | IP | Fail-closed + fallback |
| OTP Verify (Email) | 5 req | 10 min | Normalized email | Fail-closed + fallback |
| Appointment Booking | 10 req | 15 min | JWT userId | Fail-open |
| Appointment Cancel | 20 req | 15 min | JWT userId | Fail-open |
| Payment | 10 req | 15 min | JWT userId | Fail-open |
| Expensive Ops | 30 req | 15 min | IP | Fail-open |

---

## Key Strategy Explained

### IP-Based Limiting (Public APIs)
Used for: Global, Auth, OTP (one limiter)

`req.ip` is made trustworthy by `app.set('trust proxy', 1)` — see Proxy Handling below.

### Account/Email-Based OTP Limiting
Used for: OTP Send, OTP Verify (second limiter)

**Two independent limiters** are applied to OTP endpoints:
1. **IP limiter**: Prevents one IP from spamming OTPs for many accounts
2. **Email limiter**: Prevents OTP spam for one account even if attacker rotates IPs

Email is taken from `req.body.email` (validated by the controller), **never** from headers like `X-Email`.

Normalization: `email.trim().toLowerCase()`

### Authenticated-User Limiting
Used for: Appointments, Payments, Cancellations

The key uses `req.body.userId` which is set by the `authUser` middleware **after JWT verification**. This is the server-verified identity extracted from the signed JWT token, not a client-supplied value.

### What We NEVER Trust
- `X-User-ID` header
- `X-Email` header
- `X-Forwarded-For` beyond the first proxy hop
- Any client-supplied identity in request body before auth middleware runs

---

## Render Proxy Handling

### Configuration
```javascript
app.set('trust proxy', 1)
```

### Why `1` and not `true`?

| Value | Behavior | Risk |
|-------|----------|------|
| `1` | Trust exactly 1 proxy hop (Render's LB) | ✅ Correct for Render |
| `true` | Trust ALL proxy hops | ❌ Attacker can inject fake IPs |
| `0` / omit | Don't trust any proxy | ❌ `req.ip` returns proxy IP |

Render's load balancer adds the client IP to `X-Forwarded-For`. With `trust proxy = 1`, Express reads the **rightmost** IP added by the single trusted proxy — this is the real client IP.

An attacker sending `X-Forwarded-For: 1.2.3.4` would have their header appear as `X-Forwarded-For: 1.2.3.4, <real-ip>`. Express with `trust proxy = 1` reads `<real-ip>` (the one set by Render), not the spoofed `1.2.3.4`.

---

## Redis Failure Behavior

### Fail-Open (Most Endpoints)
When Redis is temporarily unavailable, requests pass through without rate limiting.

**Used for**: Global, Appointment, Payment, Cancellation, Expensive Ops

**Rationale**: A brief Redis outage should not block all users from the entire application. These endpoints have authentication as a secondary protection layer.

### Fail-Closed with In-Memory Fallback (Sensitive Endpoints)
When Redis is unavailable, an in-memory rate counter provides per-instance protection.

**Used for**: Login, OTP Send, OTP Verify

**Rationale**: These are highest-abuse-risk endpoints. A Redis outage could be exploited for brute-force attacks. The in-memory fallback is not distributed (each instance has its own counter), but it's better than no protection.

**Fallback properties**:
- Max 10,000 entries to prevent memory exhaustion
- TTL-based automatic cleanup every 60 seconds
- Same rate limits as Redis configuration

---

## Deployment Configuration (Render)

### Environment Variables

Set these in your Render dashboard under Environment:

| Variable | Description |
|----------|-------------|
| `PORT` | Set by Render automatically |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `REDIS_URL` | Redis Cloud connection URL |
| `JWT_SECRET` | JWT signing secret |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_EMAIL` | Gmail address for sending emails |
| `SMTP_PASSWORD` | Gmail app password |
| `RESEND_API_KEY` | Resend.com API key |
| `STREAM_API_KEY` | Stream.io API key |
| `STREAM_API_SECRET` | Stream.io API secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `CURRENCY` | `INR` |
| `FRONTEND_URL` | Deployed frontend URL |

### Build Command
```
npm install
```

### Start Command
```
node src/index.js
```

### Health Check Path
```
/health
```

---

## Redis Cloud Setup

1. Create a free account at [Redis Cloud](https://redis.io/cloud/)
2. Create a new database (free tier is sufficient for rate limiting)
3. Copy the connection URL (format: `redis://default:<password>@<host>:<port>`)
4. Add `REDIS_URL` to Render environment variables
5. Deploy the backend
6. Verify connection in logs: `[Redis] Connected and ready for rate limiting.`

### Verifying Redis Rate-Limit Keys

Connect to your Redis Cloud instance:
```bash
redis-cli -u $REDIS_URL
```

Check for rate-limit keys:
```bash
KEYS swasthya_rl:*
```

You should see keys like:
```
swasthya_rl:global:203.0.113.1
swasthya_rl:auth:203.0.113.1
swasthya_rl:otp_send_email:email:user@example.com
```

### Verifying Shared State Across Instances

1. Scale Render to 2+ instances
2. Send 5 requests from the same IP
3. Check Redis: `GET swasthya_rl:global:YOUR_IP` — counter should be 5
4. Both instances share this counter — neither allows 100 requests independently

---

## Security Limitations

### What This System Protects Against
- ✅ Brute-force login attempts
- ✅ OTP abuse and spam
- ✅ API flooding
- ✅ Automated appointment creation
- ✅ Payment API abuse
- ✅ Excessive API requests per IP/user

### What This System Does NOT Prevent
- ❌ **DDoS attacks** — Large-scale distributed attacks require infrastructure-level protection (CDN, WAF, edge network like Cloudflare)
- ❌ **Distributed bot networks** — Thousands of unique IPs with one request each bypass IP-based limits
- ❌ **Application-layer exploits** — Rate limiting does not fix SQL injection, XSS, etc.
- ❌ **IPv6 rotation** — Attackers with /64 blocks can rotate IPs cheaply

For production at scale, consider adding:
- Cloudflare or similar CDN/WAF in front of Render
- CAPTCHA on public forms (signup, OTP)
- Account lockout after repeated failures

---

## Payment Webhook Notes

The current codebase has **no Razorpay webhook endpoints**. The `POST /api/user/verify-razorpay` route is a **client-triggered** payment verification (the client sends Razorpay's response after completing payment in the browser).

If server-to-server Razorpay webhooks are added in the future, they **must NOT** be rate-limited with user-facing limits, as legitimate payment events from Razorpay's servers could be rejected. Webhook routes should be identified by Razorpay's IP ranges and validated using webhook signatures.

---

## Testing Rate Limits

### Quick Manual Test

```bash
# Test global limit (should work for first 100 requests in 15 min)
curl http://localhost:5000/api/user/profile -H "token: YOUR_JWT"

# Test auth limit (should block after 10 attempts in 15 min)
for i in {1..12}; do
  curl -X POST http://localhost:5000/api/user/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrongpassword"}' \
    -w "\n%{http_code}\n"
done

# Test OTP limit by email (should block after 3 for same email)
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/user/send-otp \
    -H "Content-Type: application/json" \
    -d '{"email":"victim@example.com"}' \
    -w "\n%{http_code}\n"
done

# Test spoofed X-Forwarded-For (should NOT bypass with trust proxy = 1)
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 1.2.3.4" \
  -d '{"email":"test@test.com","password":"wrongpass"}'
```

### Verifying Rate Limit Headers

Successful responses include standard headers:
```
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 900
```

429 responses include:
```
Retry-After: 900
RateLimit-Limit: 100
RateLimit-Remaining: 0
```
