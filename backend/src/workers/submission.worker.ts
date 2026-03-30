// import { Worker } from "bullmq";
// import { submissionRedis } from "../store/submission.store.ts";
// import { processSubmission } from "../services/executor.service.ts";

// const submissionWorker = new Worker(
//   "submissionQueue",
//   async (job) => {
//     const { language, code, testCases } = job.data;

//     console.log("Processing submission started:", job.id);

//     await processSubmission({
//         jobId: job.id as string,
//         language,
//         code,
//         testCases
//     });

//     console.log("Processing submission finished:", job.id);
//   },
//   {
//     connection: submissionRedis,
//     concurrency: 3,
//   }
// );

// submissionWorker.on("failed", (job, err) => {
//     console.log(`Processing submission failed: ${job!.id}`, err);
// })

// console.log("Submission Worker Started...");