import { messageQueue } from "../queues/message.queue.js";

export const createJob = async (req, res) => {
  try {
    const { name, message, shouldFail = false } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "name and message are required",
      });
    }

    const job = await messageQueue.add(
      "send-message",
      {
        name,
        message,
        shouldFail,
      },
      {
        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 2000,
        },

        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Job added successfully",
      jobId: job.id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await messageQueue.getJobs([
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
    ]);

    const formattedJobs = await Promise.all(
      jobs.map(async (job) => ({
        id: job.id,
        name: job.name,
        data: job.data,

        state: await job.getState(),

        attemptsMade: job.attemptsMade,

        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,

        failedReason: job.failedReason || null,

        returnValue: job.returnvalue || null,
      })),
    );

    return res.json({
      success: true,
      count: formattedJobs.length,
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};
export const getQueueStats = async (req, res) => {
  try {
    const counts = await messageQueue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
    );

    return res.json({
      success: true,
      counts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch queue stats",
    });
  }
};
