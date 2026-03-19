import { Worker } from "bullmq";
import { processAttemptInBackground } from "../services/test.service.ts";
import { attemptRedis } from "../store/attempt.store.ts";
import { connectDB } from "../config/db.config.ts";
import dotenv from "dotenv";    

dotenv.config();

export const attemptWorker = new Worker(
  "attempt-queue",
  async (job) => {
    await connectDB();
    const { student_attempt_id } = job.data;

    console.log("Processing attempt started:", job.id, student_attempt_id);

    await processAttemptInBackground(student_attempt_id);

    console.log("Processing attempt completed:", job.id, student_attempt_id)
  },
  {
    connection: attemptRedis,
    concurrency: 2 // 🔥 VERY IMPORTANT
  }
);

attemptWorker.on("failed", (job, err) => {
    console.log(`Processing attempt failed: ${job!.id}`, err);
})

console.log("Attempt Worker Started...");