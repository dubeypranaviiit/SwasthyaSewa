import { Queue, Worker } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

let emailQueue = null;
let emailWorker = null;
let isQueueReady = false;

let directDispatcher = null;

export const setDirectEmailDispatcher = (dispatcher) => {
    directDispatcher = dispatcher;
};

const parseRedisUrl = (redisUrl) => {
    if (!redisUrl) return null;
    try {
        const url = new URL(redisUrl);
        return {
            host: url.hostname || "127.0.0.1",
            port: parseInt(url.port || "6379", 10),
            username: url.username || undefined,
            password: url.password || undefined,
            tls: url.protocol === "rediss:" ? {} : undefined,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        };
    } catch (err) {
        console.warn("[BullMQ] Invalid REDIS_URL format, attempting standard connection options.");
        return null;
    }
};

export const initEmailQueue = () => {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        console.warn("[BullMQ] REDIS_URL not configured. Email Queue will use direct async fallback.");
        return null;
    }

    const connectionOptions = parseRedisUrl(redisUrl);
    if (!connectionOptions) {
        return null;
    }

    try {
        emailQueue = new Queue("swasthya-email-queue", {
            connection: connectionOptions,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000,
                },
                removeOnComplete: { count: 100 },
                removeOnFail: { count: 500 },
            },
        });

        emailWorker = new Worker(
            "swasthya-email-queue",
            async (job) => {
                const { type, payload } = job.data;
                console.log(`[BullMQ Worker] Processing job ${job.id} (type: ${type}) to: ${payload.to || payload.email}`);

                if (directDispatcher) {
                    const result = await directDispatcher(type, payload);
                    if (!result) {
                        throw new Error(`Email dispatch returned false for job ${job.id}`);
                    }
                    return result;
                } else {
                    console.warn(`[BullMQ Worker] No direct dispatcher configured for job ${job.id}`);
                    return true;
                }
            },
            {
                connection: connectionOptions,
                concurrency: 5,
            }
        );

        emailWorker.on("completed", (job) => {
            console.log(`[BullMQ Worker] Job ${job.id} (${job.data.type}) completed successfully.`);
        });

        emailWorker.on("failed", (job, err) => {
            const isFinalAttempt = job && job.attemptsMade >= (job.opts?.attempts || 3);
            if (isFinalAttempt) {
                console.error(
                    `[BullMQ DLQ] Job ${job?.id} (${job?.data?.type}) permanently FAILED after ${job?.attemptsMade} attempts. Target: ${job?.data?.payload?.email || job?.data?.payload?.to}. Error: ${err.message}`
                );
            } else {
                console.warn(
                    `[BullMQ Worker] Job ${job?.id} attempt ${job?.attemptsMade} failed: ${err.message}. Retrying with exponential backoff...`
                );
            }
        });

        emailWorker.on("error", (err) => {
            console.error(`[BullMQ Worker] Worker connection error: ${err.message}`);
        });

        isQueueReady = true;
        console.log("[BullMQ] Email Queue and Worker initialized successfully with Redis.");
        return emailQueue;
    } catch (err) {
        console.error(`[BullMQ] Failed to initialize BullMQ: ${err.message}`);
        isQueueReady = false;
        return null;
    }
};

export const enqueueEmailJob = async (type, payload) => {
    if (isQueueReady && emailQueue) {
        try {
            const job = await emailQueue.add(
                type,
                { type, payload, queuedAt: Date.now() },
                {
                    jobId: `email-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                }
            );
            return { success: true, enqueued: true, jobId: job.id };
        } catch (err) {
            console.warn(`[BullMQ] Enqueue failed (${err.message}). Falling back to direct async dispatch.`);
        }
    }

    setImmediate(async () => {
        try {
            if (directDispatcher) {
                await directDispatcher(type, payload);
            }
        } catch (dispatchErr) {
            console.error(`[Direct Fallback Email] Error sending email (${type}):`, dispatchErr.message);
        }
    });

    return { success: true, enqueued: false, fallback: true };
};

export const getEmailQueue = () => emailQueue;
export const isEmailQueueReady = () => isQueueReady;
