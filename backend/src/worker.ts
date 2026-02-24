// import { Worker } from "bullmq";
// import { redis } from "./store/redis.store.ts";
// import { processSubmission } from "./services/executor.service.ts";

// const worker = new Worker(
//   "submissionQueue",
//   async (job) => {
//     console.log("Processing job:", job.id);

//     await processSubmission(
//       job.id as string,
//       job.data.language,
//       job.data.code,
//       job.data.testCases
//     );

//     console.log("Finished job:", job.id);
//   },
//   {
//     connection: redis,
//     concurrency: 3,
//   }
// );

// worker.on("failed", (job, err) => {
//     console.log("Job failed:", err);
// })

// console.log("Worker started...");