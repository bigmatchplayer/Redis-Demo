import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import jobRoutes from "../src/routes/job.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Redis + BullMQ server running",
  });
});

app.use("/api", jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});
