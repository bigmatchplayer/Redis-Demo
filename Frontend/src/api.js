import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createJob = (data) => api.post("/jobs", data);

export const getJobs = () => api.get("/jobs");

export const getStats = () => api.get("/stats");
