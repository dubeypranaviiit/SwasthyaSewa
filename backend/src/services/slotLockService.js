import { getRedisClient, isRedisReady } from "../config/redis.js";

const memoryLocks = new Map();

const cleanExpiredMemoryLocks = () => {
    const now = Date.now();
    for (const [key, val] of memoryLocks.entries()) {
        if (val.expiresAt <= now) {
            memoryLocks.delete(key);
        }
    }
};

const getSlotKey = (docId, slotDate, slotTime) => {
    const sanitizedDate = String(slotDate).trim().replace(/\s+/g, "_");
    const sanitizedTime = String(slotTime).trim().replace(/\s+/g, "_");
    return `lock:doctor:${docId}:slot:${sanitizedDate}_${sanitizedTime}`;
};

export const acquireSlotHold = async (docId, slotDate, slotTime, userId, ttlSeconds = 300) => {
    if (!docId || !slotDate || !slotTime || !userId) {
        return { success: false, acquired: false, message: "Missing required slot parameters" };
    }

    const key = getSlotKey(docId, slotDate, slotTime);
    const client = getRedisClient();

    if (isRedisReady() && client) {
        try {
            const acquired = await client.set(key, String(userId), {
                NX: true,
                EX: ttlSeconds,
            });

            if (acquired === "OK") {
                return {
                    success: true,
                    acquired: true,
                    key,
                    ttl: ttlSeconds,
                    message: "Slot hold acquired successfully",
                };
            }

            const currentHolder = await client.get(key);
            if (currentHolder === String(userId)) {
                const ttl = await client.ttl(key);
                return {
                    success: true,
                    acquired: true,
                    isOwner: true,
                    key,
                    ttl: ttl > 0 ? ttl : ttlSeconds,
                    message: "Slot hold re-confirmed by current holder",
                };
            }

            const remainingTtl = await client.ttl(key);
            return {
                success: false,
                acquired: false,
                key,
                ttl: remainingTtl > 0 ? remainingTtl : 0,
                message: "Slot currently held by another patient. Please choose a different slot.",
            };
        } catch (redisErr) {
            console.warn(`[SlotLockService] Redis error during acquire: ${redisErr.message}. Using fallback.`);
        }
    }

    cleanExpiredMemoryLocks();
    const existing = memoryLocks.get(key);
    const now = Date.now();

    if (existing && existing.expiresAt > now) {
        if (existing.userId === String(userId)) {
            const ttl = Math.max(1, Math.round((existing.expiresAt - now) / 1000));
            return {
                success: true,
                acquired: true,
                isOwner: true,
                key,
                ttl,
                message: "Slot hold re-confirmed in memory",
            };
        }
        return {
            success: false,
            acquired: false,
            key,
            ttl: Math.max(1, Math.round((existing.expiresAt - now) / 1000)),
            message: "Slot currently held by another patient. Please choose a different slot.",
        };
    }

    memoryLocks.set(key, {
        userId: String(userId),
        expiresAt: now + ttlSeconds * 1000,
    });

    return {
        success: true,
        acquired: true,
        key,
        ttl: ttlSeconds,
        message: "Slot hold acquired in fallback memory",
    };
};

export const releaseSlotHold = async (docId, slotDate, slotTime, userId) => {
    const key = getSlotKey(docId, slotDate, slotTime);
    const client = getRedisClient();

    if (isRedisReady() && client) {
        try {
            const luaScript = `
                if redis.call("get", KEYS[1]) == ARGV[1] then
                    return redis.call("del", KEYS[1])
                else
                    return 0
                end
            `;
            const result = await client.eval(luaScript, {
                keys: [key],
                arguments: [String(userId)],
            });

            return {
                success: true,
                released: result === 1,
            };
        } catch (redisErr) {
            console.warn(`[SlotLockService] Redis error during release: ${redisErr.message}. Using fallback.`);
        }
    }

    const existing = memoryLocks.get(key);
    if (existing && existing.userId === String(userId)) {
        memoryLocks.delete(key);
        return { success: true, released: true };
    }

    return { success: true, released: false };
};

export const getSlotHoldStatus = async (docId, slotDate, slotTime) => {
    const key = getSlotKey(docId, slotDate, slotTime);
    const client = getRedisClient();

    if (isRedisReady() && client) {
        try {
            const holder = await client.get(key);
            if (holder) {
                const ttl = await client.ttl(key);
                return {
                    isHeld: true,
                    holderId: holder,
                    ttl: ttl > 0 ? ttl : 0,
                };
            }
            return { isHeld: false, ttl: 0 };
        } catch (redisErr) {
            console.warn(`[SlotLockService] Redis error during status check: ${redisErr.message}`);
        }
    }

    cleanExpiredMemoryLocks();
    const existing = memoryLocks.get(key);
    const now = Date.now();
    if (existing && existing.expiresAt > now) {
        return {
            isHeld: true,
            holderId: existing.userId,
            ttl: Math.max(1, Math.round((existing.expiresAt - now) / 1000)),
        };
    }

    return { isHeld: false, ttl: 0 };
};
