import express from "express";

import {
  createJob,
  getJobs,
  getQueueStats,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/jobs", createJob);

router.get("/jobs", getJobs);

router.get("/stats", getQueueStats);

export default router;
