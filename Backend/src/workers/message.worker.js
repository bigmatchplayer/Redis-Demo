import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { processMessage } from "../services/message.service.js";

const worker = new Worker(
  "message-queue",

  async (job) => {
    console.log("\n=================================");
    console.log("JOB STARTED");
    console.log("Job ID:", job.id);
    console.log("Job Name:", job.name);
    console.log("Job Data:", job.data);
    console.log("Attempt:", job.attemptsMade + 1);
    console.log("=================================\n");

    const result = await processMessage(job.data);

    return result;
  },

  {
    connection: redisConnection,

    // Process 2 jobs simultaneously
    concurrency: 2,
  },
);

worker.on("completed", (job, result) => {
  console.log(`✅ Job ${job.id} completed`);
  console.log("Result:", result);
});

worker.on("failed", (job, error) => {
  console.log(`❌ Job ${job?.id} failed`);
  console.log("Reason:", error.message);
});

worker.on("error", (error) => {
  console.error("Worker error:", error);
});

console.log("🚀 Worker started");
