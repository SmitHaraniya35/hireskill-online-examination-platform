/*********************************************************************************************/
/*************************** Using Worker, Queue and Redis ***********************************/
/*********************************************************************************************/

// import { spawn } from "child_process";
// import fs from "fs";
// import path from "path";
// import { languages } from "../config/languages.config.js";
// import { redis } from "../store/redis.store.js";
// import { v4 as uuid } from "uuid";
// import type { SubmissionJob, TestCaseResult, WorkerResponse } from "../types/controller/executorData.types.ts";

// const TIME_LIMIT = 1000;
// const MEMORY_LIMIT = 256;

// export const processSubmission = async ({
//   jobId,
//   language,
//   code,
//   testCases
// }: SubmissionJob) => {

//   const config = languages[language];
//   if (!config) throw new Error("Unsupported language");

//   const submissionId = uuid();
//   const submissionsPath = path.join("submissions", submissionId);

//   fs.mkdirSync(submissionsPath, { recursive: true });

//   const filename = `Main.${config.extension}`;
//   fs.writeFileSync(path.join(submissionsPath, filename), code);

//   const containerName = `judge_${submissionId}`;

//   let results: TestCaseResult[] = [];

//   try {

//     const response: WorkerResponse = {
//         status: "Running",
//         results,
//     }

//     await redis.set(
//       `job:${jobId}`,
//       JSON.stringify(response)
//     );

//     await startContainer(containerName, submissionsPath, config.image);

//     // 🔧 Compile if needed
//     if (config.compile) {
//       try {
//         await execInContainer(containerName, config.compile.join(" "));
//       } catch (err: any) {
//         const response: WorkerResponse = {
//             status: "Completed",
//             error: "Compilation Error",
//             message: err.message
//         };

//         await redis.set(`job:${jobId}`, JSON.stringify(response));

//         return;
//       }
//     }

//     if (config.syntax) {
//       try {
//         await execInContainer(containerName, config.syntax.join(" "));
//       } catch (err: any) {
//         const response: WorkerResponse = {
//             status: "Completed",
//             error: "Runtime Error",
//             message: err.message
//         };

//         await redis.set(`job:${jobId}`, JSON.stringify(response));

//         return;
//       }
//     }

//     const start = Date.now();

//     for (let i = 0; i < testCases.length; i++) {

//       const test = testCases[i];
//       const caseStart = Date.now();

//       try {

//         const output = await execWithInput(
//           containerName,
//           config.run.join(" "),
//           test!.input
//         );

//         const time = Date.now() - caseStart;

//         const actual = normalize(output);
//         const expected = normalize(test!.expected);

//         const result: TestCaseResult = {
//           index: i,
//           testCaseId: test!.testCaseId,
//           status: actual === expected ? "Accepted" : "Wrong Answer",
//           output: actual,
//           expected,
//           time
//         };

//         results.push(result);
//         response.results = results;
//         await redis.set(`job:${jobId}`, JSON.stringify(response));

//       } catch (err: any) {
//         const result: TestCaseResult = {
//           index: i,
//           testCaseId: test!.testCaseId,
//           status: err.message,
//           expected: test!.expected,
//           time: 0
//         };

//         results.push(result);
//         response.results = results;
//         await redis.set(`job:${jobId}`, JSON.stringify(response));
//       }
//     }

//     response.status = "Completed";
//     response.results = results;
//     response.time = Date.now() - start;

//     await redis.set(`job:${jobId}`, JSON.stringify(response));

//   } catch (err: any) {
//     const response: WorkerResponse = {
//         status: "Failed",
//         error: err.message
//     };

//     await redis.set(`job:${jobId}`, JSON.stringify(response));

//   } finally {

//     await stopContainer(containerName);

//     fs.rmSync(submissionsPath, {
//       recursive: true,
//       force: true
//     });
//   }
// };

// const startContainer = (
//   containerName: string,
//   submissionsPath: string,
//   image: string
// ): Promise<void> => {

//   return new Promise((resolve, reject) => {

//     const docker = spawn("docker", [
//       "run",
//       "-d",
//       "--rm",
//       "--name",
//       containerName,

//       "--memory",
//       `${MEMORY_LIMIT}m`,

//       "--cpus",
//       "0.5",

//       "--pids-limit",
//       "50",

//       "--network",
//       "none",

//       "--read-only",

//       "-v",
//       `${path.resolve(submissionsPath)}:/app`,

//       "-w",
//       "/app",

//       image,

//       "sleep",
//       "300"
//     ]);

//     let err = "";

//     docker.stderr.on("data", d => err += d.toString());

//     docker.on("close", code => {
//       if (code !== 0) reject(new Error(err || "Container start failed"));
//       else resolve();
//     });
//   });
// };

// const execInContainer = (
//   containerName: string,
//   command: string
// ): Promise<string> => {

//   return new Promise((resolve, reject) => {

//     const docker = spawn("docker", [
//       "exec",
//       containerName,
//       "sh",
//       "-c",
//       command
//     ]);

//     let stdout = "";
//     let stderr = "";

//     docker.stdout.on("data", d => stdout += d.toString());
//     docker.stderr.on("data", d => stderr += d.toString());

//     docker.on("close", code => {

//       if (code !== 0) return reject(new Error(stderr || "Runtime Error"));

//       resolve(stdout);

//     });
//   });
// };

// const execWithInput = (
//   containerName: string,
//   runCommand: string,
//   input: string
// ): Promise<string> => {

//   return new Promise((resolve, reject) => {

//     const docker = spawn("docker", [
//       "exec",
//       "-i",
//       containerName,
//       "sh",
//       "-c",
//       `timeout ${TIME_LIMIT / 1000}s ${runCommand}`
//     ]);

//     let stdout = "";
//     let stderr = "";

//     docker.stdout.on("data", d => stdout += d.toString());
//     docker.stderr.on("data", d => stderr += d.toString());

//     docker.stdin.write(input);
//     docker.stdin.end();

//     docker.on("close", code => {

//       if (code === 124) return reject(new Error("Time Limit Exceeded"));

//       if (code === 137) return reject(new Error("Memory Limit Exceeded"));

//       if (code === 139) return reject(new Error("Runtime Error"));

//       if (code !== 0) return reject(new Error(stderr || "Runtime Error"));

//       resolve(stdout);
//     });
//   });
// };

// const stopContainer = (containerName: string): Promise<void> => {

//   return new Promise(resolve => {

//     spawn("docker", ["rm", "-f", containerName])
//       .on("close", () => resolve());

//   });
// };

// const normalize = (str: string) =>
//   str.trim().replace(/\r/g, "");

/*********************************************************************************************/
/*************************** Without Worker, Queue and Redis ***********************************/
/*********************************************************************************************/

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { languages } from "../config/languages.config.js";
import { v4 as uuid } from "uuid";
import type { CodeExecutionData, TestCaseResult, WorkerResponse } from "../types/controller/executorData.types.ts";
import { ERROR_MESSAGES } from "../constants/index.ts";
import { getAllTestCasesByProblemIdService } from "./testCase.service.ts";
import { createSubmissionService } from "./submission.service.ts";

const TIME_LIMIT = 1000;
const MEMORY_LIMIT = 256;

export const processSubmission = async ({
  language,
  code,
  testCases
}: any) => {

  const start = Date.now();

  const config = languages[language];
  if (!config) {
    const workerResponse: WorkerResponse = {
      status: "Failed",
      error: ERROR_MESSAGES.UNSUPPORTED_LANGUAGE,
    };

    return workerResponse;
  };

  const submissionId = uuid();
  const submissionsPath = path.join("submissions", submissionId);

  fs.mkdirSync(submissionsPath, { recursive: true });

  const filename = `Main.${config.extension}`;
  fs.writeFileSync(path.join(submissionsPath, filename), code);

  const containerName = `judge_${submissionId}`;

  let results: TestCaseResult[] = [];

  try {

    const response: WorkerResponse = {
        status: "Running",
        results,
    }

    await startContainer(containerName, submissionsPath, config.image);

    // 🔧 Compile if needed
    if (config.compile) {
      try {
        await execInContainer(containerName, config.compile.join(" "));
      } catch (err: any) {
        const response: WorkerResponse = {
            status: "Completed",
            error: "Compilation Error",
            message: err.message,
            time: Date.now() - start
        };

        return response;
      }
    }

    if (config.syntax) {
      try {
        await execInContainer(containerName, config.syntax.join(" "));
      } catch (err: any) {
        const response: WorkerResponse = {
            status: "Completed",
            error: "Runtime Error",
            message: err.message,
            time: Date.now() - start
        };

        return response;
      }
    }

    for (let i = 0; i < testCases.length; i++) {

      const test = testCases[i];
      const caseStart = Date.now();

      try {

        const output = await execWithInput(
          containerName,
          config.run.join(" "),
          test!.input
        );

        const time = Date.now() - caseStart;

        const actual = normalize(output);
        const expected = normalize(test!.expected);

        const result: TestCaseResult = {
          index: i,
          testCaseId: test!.testCaseId,
          input: test!.input,
          output: actual,
          expected,
          status: actual === expected ? "Accepted" : "Wrong Answer",
          time
        };

        results.push(result);
        response.results = results;

      } catch (err: any) {
        const response: WorkerResponse = {
            status: "Completed",
            error: err.message,
            time: Date.now() - start
        };

        return response;
      }
    }

    response.status = "Completed";
    response.results = results;
    response.time = Date.now() - start;

    return response;

  } catch (err: any) {
    const response: WorkerResponse = {
        status: "Failed",
        error: err.message,
        time: Date.now() - start
    };

    return response;

  } finally {

    await stopContainer(containerName);

    fs.rmSync(submissionsPath, {
      recursive: true,
      force: true
    });
  }
};

const startContainer = (
  containerName: string,
  submissionsPath: string,
  image: string
): Promise<void> => {

  return new Promise((resolve, reject) => {

    const docker = spawn("docker", [
      "run",
      "-d",
      "--rm",
      "--name",
      containerName,

      "--memory",
      `${MEMORY_LIMIT}m`,

      "--cpus",
      "0.5",

      "--pids-limit",
      "50",

      "--network",
      "none",

      "--read-only",

      "-v",
      `${path.resolve(submissionsPath)}:/app`,

      "-w",
      "/app",

      image,

      "sleep",
      "300"
    ]);

    let err = "";

    docker.stderr.on("data", d => err += d.toString());

    docker.on("close", code => {
      if (code !== 0) reject(new Error(err || "Container start failed"));
      else resolve();
    });
  });
};

const execInContainer = (
  containerName: string,
  command: string
): Promise<string> => {

  return new Promise((resolve, reject) => {

    const docker = spawn("docker", [
      "exec",
      containerName,
      "sh",
      "-c",
      command
    ]);

    let stdout = "";
    let stderr = "";

    docker.stdout.on("data", d => stdout += d.toString());
    docker.stderr.on("data", d => stderr += d.toString());

    docker.on("close", code => {

      if (code !== 0) return reject(new Error(stderr || "Runtime Error"));

      resolve(stdout);

    });
  });
};

const execWithInput = (
  containerName: string,
  runCommand: string,
  input: string
): Promise<string> => {

  return new Promise((resolve, reject) => {

    const docker = spawn("docker", [
      "exec",
      "-i",
      containerName,
      "sh",
      "-c",
      `timeout ${TIME_LIMIT / 1000}s ${runCommand}`
    ]);

    let stdout = "";
    let stderr = "";

    docker.stdout.on("data", d => stdout += d.toString());
    docker.stderr.on("data", d => stderr += d.toString());

    docker.stdin.write(input);
    docker.stdin.end();

    docker.on("close", code => {
      if (code === 124) return reject(new Error("Time Limit Exceeded"));

      if (code === 137) return reject(new Error("Memory Limit Exceeded"));

      if (code === 136) return reject(new Error("Runtime Error (Division By Zero)"));

      if (code === 132) return reject(new Error("Runtime Error (Division By Zero)"));

      if (code !== 0) return reject(new Error(stderr || "Runtime Error"));

      resolve(stdout);
    });
  });
};

const stopContainer = (containerName: string): Promise<void> => {

  return new Promise(resolve => {

    spawn("docker", ["rm", "-f", containerName])
      .on("close", () => resolve());

  });
};

const normalize = (str: string) =>
  str.trim().replace(/\r/g, "");

export const submitCodeService = async (input: CodeExecutionData) => {

    const { assignedProblemId, problemId, language, code } = input;

    if (!problemId) {
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_ID_REQUIRED);
    }

    if (!assignedProblemId) {
        throw new Error(ERROR_MESSAGES.ASSIGNED_PROBLEM_ID_REQUIRED);
    }

    // 1. Fetch test cases
    const { testCases } = await getAllTestCasesByProblemIdService(problemId);

    const formattedTestCases = testCases.map(tc => ({
        testCaseId: tc.id,
        input: tc.input,
        expected: tc.expected_output
    }));

    // 2. Execute code
    const data = await processSubmission({
        language,
        code,
        testCases: formattedTestCases
    });

    // 3. Calculate output and status of code execution
    const totalTestCases = testCases?.length || 0;

    const passedTestCases = data.results
        ? data.results.filter((r: any) => r.status === "Accepted").length
        : 0;

    let resultStatus = data.error as string;

    if (!data.error) {
        if (totalTestCases === passedTestCases && totalTestCases > 0) {
            resultStatus = "Accepted";
        } else if (passedTestCases > 0) {
            resultStatus = "Partially Accepted";
        } else {
            resultStatus = "Failed";
        }
    }
    
    // 4. Save submission
    await createSubmissionService({
        assigned_problem_id: assignedProblemId,
        language,
        source_code: code,
        submitted_at: new Date(),
        total_test_cases: totalTestCases,
        passed_test_cases: passedTestCases,
        status: resultStatus || data.error!,
        execution_time: data.time ? `${data.time} ms` : "",
    });

    // 5. Return response
    return data.error
        ? data
        : {
            totalTestCases,
            passedTestCases,
            ...data
        };
};