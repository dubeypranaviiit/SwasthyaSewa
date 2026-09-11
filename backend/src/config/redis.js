import { createClient } from "redis";

let redisClient = null;
let redisReady = false;

const sanitizeRedisUrl = (url) => {
    try {
        const parsed = new URL(url);
        parsed.username = "***";
        parsed.password = "***";
        return parsed.toString();
    } catch {
        return "redis://[invalid-url]";
    }
};

const initRedis = async () => {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        console.warn("[Redis] REDIS_URL not set. Rate limiting will use fallback strategies.");
        return null;
    }

    try {
        redisClient = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 20) {
                        console.error("[Redis] Max reconnection attempts reached. Giving up.");
                        return new Error("Max reconnection attempts reached");
                    }
                    return Math.min(retries * 200, 10000);
                },
                connectTimeout: 10000,
            },
        });

        redisClient.on("error", (err) => {
            redisReady = false;
            console.error(`[Redis] Connection error: ${err.message}`);
        });

        redisClient.on("connect", () => {
            console.log(`[Redis] Connecting to ${sanitizeRedisUrl(redisUrl)}`);
        });

        redisClient.on("ready", () => {
            redisReady = true;
            console.log("[Redis] Connected and ready for rate limiting.");
        });

        redisClient.on("end", () => {
            redisReady = false;
            console.warn("[Redis] Connection closed.");
        });

        await redisClient.connect();

        return redisClient;
    } catch (err) {
        console.error(`[Redis] Failed to initialize: ${err.message}`);
        redisClient = null;
        redisReady = false;
        return null;
    }
};

const getRedisClient = () => redisClient;
const isRedisReady = () => redisReady;

export { initRedis, getRedisClient, isRedisReady };
