import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = createClient({ url: redisUrl });

export async function ensureRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
}
