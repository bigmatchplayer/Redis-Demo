import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const messageQueue = new Queue("message-queue", {
  connection: redisConnection,
});
