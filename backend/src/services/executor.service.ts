// // import { spawn } from "child_process";
// // import fs from "fs";
// // import path from "path";
// // import { languages } from "../config/languages.config.ts";
// // import { redis } from "../store/redis.store.ts";
// // import { fileURLToPath } from "url";

// // const TIME_LIMIT = 3000;

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // export const processSubmission = async function (
// //   jobId: string,
// //   language: string,
// //   code: string,
// //   testCases: { input: string; expected: string }[],
// // ) {
// //   const config = languages[language];
// //   if (!config) return;

// //   await redis.set(
// //     `job:${jobId}`,
// //     JSON.stringify({
// //       status: "running",
// //       results: [],
// //     }),
// //   );

// //   const submissionId = Date.now().toString();
// //   const submissionsPath = path.join(__dirname, "../submissions", submissionId);
// //   fs.mkdirSync(submissionsPath, { recursive: true });

// //   const filename = `Main.${config.extension}`;
// //   fs.writeFileSync(path.join(submissionsPath, filename), code);

// //   let results: any[] = [];

// //   try {
// //     // Compile once
// //     if (config.compile) {
// //       await runDocker(submissionsPath, config.image, config.compile);
// //     }

// //     const start = Date.now();
// //     for (let i = 0; i < testCases.length; i++) {
// //       const start = Date.now();

// //       try {
// //         /********************* Executing all testCases in separate container *********************/
// //         // const output = await runDocker(
// //         //     submissionsPath,
// //         //     config.image,
// //         //     config.run,
// //         //     testCases[i]!.input,
// //         // );

// //         // console.log(`${i}: `, output);

// //         // const time = Date.now() - start;

// //         // const result = {
// //         //     index: i,
// //         //     status:
// //         //       normalize(output) === normalize(testCases[i]!.expected)
// //         //         ? "Accepted"
// //         //         : "Wrong Answer",
// //         //     output: normalize(output),
// //         //     expected: normalize(testCases[i]!.expected),
// //         //     time,
// //         // };

// //         // results.push(result);

// //         // await redis.set(
// //         //     `job:${jobId}`,
// //         //     JSON.stringify({
// //         //         status: "running",
// //         //         results,
// //         //     }),
// //         // );

// //         /******************* Executing all testCases in One Container ****************************/
// //         const combinedInput = testCases[0]!.input;
// //         const expectedOutput = testCases[0]!.expected;

// //         const output = await runDocker(
// //           submissionsPath,
// //           config.image,
// //           config.run,
// //           combinedInput,
// //         );

// //         const outputLines = output.trim().split("\n");
// //         const expectedLines = expectedOutput.trim().split("\n");

// //         // let results = [];

// //         for (let i = 0; i < expectedLines.length; i++) {
// //           const actual = (outputLines[i] || "").trim();
// //           const expectedLine = expectedLines[i]!.trim();

// //           if (actual === expectedLine) {
// //             results.push({
// //               index: i,
// //               status: "Accepted",
// //               output: actual,
// //               expected: expectedLine
// //             });
// //           } else {
// //             results.push({
// //               index: i,
// //               status: "Wrong Answer",
// //               output: actual,
// //               expected: expectedLine
// //             });
// //           }
// //         }

// //         // Extra output check
// //         if (outputLines.length > expectedLines.length) {
// //           results.push({
// //             index: expectedLines.length,
// //             status: "Extra Output",
// //             output: outputLines.slice(expectedLines.length).join("\n"),
// //             expected: "No extra output expected"
// //           });
// //         }
// //         /***********************************************/

// //       } catch (err: any) {
// //         console.log(err);
// //         const result = {
// //             index: i,
// //             status: err.message,
// //             stdout: "",
// //             output: testCases[i]!.expected,
// //             time: 0,
// //         };

// //         results.push(result);

// //         await redis.set(
// //             `job:${jobId}`,
// //             JSON.stringify({
// //                 status: "running",
// //                 results,
// //             }),
// //         );
// //       }
// //     }
// //     console.log(results);

// //     await redis.set(
// //         `job:${jobId}`,
// //         JSON.stringify({
// //             status: "completed",
// //             time: Date.now() - start,
// //             results,
// //         }),
// //     );
// //   } catch (err: any) {
// //     console.log(err);
// //     await redis.set(
// //         `job:${jobId}`,
// //         JSON.stringify({
// //             status: "failed",
// //             results: err.message,
// //         }),
// //     );
// //   } finally {
// //     console.log("final");
// //     fs.rmSync(submissionsPath, { recursive: true, force: true });
// //   }
// // }

// // const normalize = (str: string) => {
// //   return str!.trim().replace(/\r/g, "");
// // }

// // const runDocker = (
// //   submissionsPath: string,
// //   image: string,
// //   command: string[],
// //   input?: string,
// // ): Promise<string> => {
// //   return new Promise((resolve, reject) => {
// //     const docker = spawn("docker", [
// //       "run",
// //       "--rm",
// //       "-i",
// //       "--memory=256m",
// //       "--cpus=0.5",
// //       "--pids-limit=50",
// //       "--network=none",
// //       "-v",
// //       `${submissionsPath}:/app`,
// //       image,
// //       ...command,
// //     ]);

// //     let output = "";
// //     let error = "";
// //     let killed = false;

// //     const timer = setTimeout(() => {
// //       killed = true;
// //       docker.kill("SIGKILL");
// //     }, TIME_LIMIT);

// //     docker.stdout.on("data", (data) => {
// //       output += data.toString();
// //     });

// //     docker.stderr.on("data", (data) => {
// //       error += data.toString();
// //     });

// //     if (input) docker.stdin.write(input);
// //     docker.stdin.end();

// //     docker.on("close", (code) => {
// //       clearTimeout(timer);

// //       if (killed) return reject(new Error("Time Limit Exceeded"));
// //       if (code === 137) return reject(new Error("Memory Limit Exceeded"));
// //       if (code !== 0) return reject(new Error(error || "Runtime Error"));

// //       resolve(output);
// //     });
// //   });
// // }



// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////// 1 Container + combined all input testcases + stream onLine ///////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // import { spawn } from "child_process";
// // import fs from "fs";
// // import path from "path";
// // import { languages } from "../config/languages.config.ts";
// // import { fileURLToPath } from "url";
// // import { Redis } from "ioredis";

// // const redis = new Redis({
// //   host: "127.0.0.1",
// //   port: 6379,
// // });

// // const TIME_LIMIT = 3000;

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // export const processSubmission = async function (
// //   jobId: string,
// //   language: string,
// //   code: string,
// //   testCases: { input: string; expected: string }[],
// // ) {

// //   const config = languages[language];
// //   if (!config) return;

// //   await redis.set(
// //     `job:${jobId}`,
// //     JSON.stringify({
// //       status: "running",
// //       results: [],
// //     }),
// //   );

// //   console.log("Set initial status of job")

// //   const submissionId = Date.now().toString();
// //   const submissionsPath = path.join(__dirname, "../submissions", submissionId);
// //   fs.mkdirSync(submissionsPath, { recursive: true });

// //   const filename = `Main.${config.extension}`;
// //   fs.writeFileSync(path.join(submissionsPath, filename), code);

// //   let results: any[] = [];

// //   try {
// //     // ✅ Compile once
// //     if (config.compile) {
// //       await runDocker(
// //         submissionsPath,
// //         config.image,
// //         config.compile
// //       );
// //     }

// //     // ✅ Combine all test inputs
// //     const combinedInput = testCases
// //       .map(tc => tc.input.trim())
// //       .join("\n") + "\n";

// //     // ✅ Flatten expected outputs
// //     const expectedLines = testCases
// //       .map(tc => normalize(tc.expected))
// //       .flatMap(e => e.split("\n"));

// //     let testIndex = 0;
// //     console.log("Before calling runDockerStream")
// //     // ✅ Run once & stream output
// //     await runDockerStream(
// //       submissionsPath,
// //       config.image,
// //       config.run,
// //       combinedInput,
// //       async (line: string) => {
// //         const actual = normalize(line);
// //         const expected = expectedLines[testIndex] || "";

// //         const result = {
// //           index: testIndex,
// //           status: actual === expected ? "Accepted" : "Wrong Answer",
// //           output: actual,
// //           expected,
// //         };

// //         results.push(result);

// //         await redis.set(
// //           `job:${jobId}`,
// //           JSON.stringify({
// //             status: "running",
// //             results,
// //           }),
// //         );

// //         testIndex++;
// //       }
// //     );

// //     // ✅ Handle missing outputs
// //     while (testIndex < expectedLines.length) {
// //       results.push({
// //         index: testIndex,
// //         status: "No Output",
// //         output: "",
// //         expected: expectedLines[testIndex],
// //       });
// //       testIndex++;
// //     }

// //     await redis.set(
// //       `job:${jobId}`,
// //       JSON.stringify({
// //         status: "completed",
// //         results,
// //       }),
// //     );

// //   } catch (err: any) {
// //     await redis.set(
// //       `job:${jobId}`,
// //       JSON.stringify({
// //         status: "failed",
// //         error: err.message,
// //         results,
// //       }),
// //     );
// //   } finally {
// //     fs.rmSync(submissionsPath, { recursive: true, force: true });
// //   }
// // };

// // const normalize = (str: string) => {
// //   return str.trim().replace(/\r/g, "");
// // };

// // const runDocker = (
// //   submissionsPath: string,
// //   image: string,
// //   command: string[],
// //   input?: string,
// // ): Promise<string> => {
// //   return new Promise((resolve, reject) => {
// //     const docker = spawn("docker", [
// //       "run",
// //       "--rm",
// //       "-i",
// //       "--memory=256m",
// //       "--cpus=0.5",
// //       "--pids-limit=50",
// //       "--network=none",
// //       "-v",
// //       `${submissionsPath}:/app`,
// //       image,
// //       ...command,
// //     ]);

// //     let output = "";
// //     let error = "";
// //     let killed = false;

// //     const timer = setTimeout(() => {
// //       killed = true;
// //       docker.kill("SIGKILL");
// //     }, TIME_LIMIT);

// //     docker.stdout.on("data", (data) => {
// //       output += data.toString();
// //     });

// //     docker.stderr.on("data", (data) => {
// //       error += data.toString();
// //     });

// //     if (input) docker.stdin.write(input);
// //     docker.stdin.end();

// //     docker.on("close", (code) => {
// //       clearTimeout(timer);

// //       if (killed) return reject(new Error("Time Limit Exceeded"));
// //       if (code === 137) return reject(new Error("Memory Limit Exceeded"));
// //       if (code !== 0) return reject(new Error(error || "Runtime Error"));

// //       resolve(output);
// //     });
// //   });
// // };

// // // const runDockerStream = (
// // //   submissionsPath: string,
// // //   image: string,
// // //   command: string[],
// // //   input: string,
// // //   onLine: (line: string) => void,
// // // ): Promise<void> => {
// // //   return new Promise((resolve, reject) => {
// // //     const docker = spawn("docker", [
// // //       "run",
// // //       "--rm",
// // //       "-i",
// // //       "--memory=256m",
// // //       "--cpus=0.5",
// // //       "--pids-limit=50",
// // //       "--network=none",
// // //       "-v",
// // //       `${submissionsPath}:/app`,
// // //       image,
// // //       ...command,
// // //     ]);

// // //     let buffer = "";
// // //     let killed = false;

// // //     const timer = setTimeout(() => {
// // //       killed = true;
// // //       docker.kill("SIGKILL");
// // //     }, TIME_LIMIT);

// // //     docker.stdout.on("data", (data) => {
// // //       buffer += data.toString();

// // //       const lines = buffer.split("\n");
// // //       buffer = lines.pop() || "";

// // //       for (const line of lines) {
// // //         if (line.trim() !== "") {
// // //           onLine(line);
// // //         }
// // //       }
// // //     });

// // //     docker.stderr.on("data", (data) => {
// // //       console.error("stderr:", data.toString());
// // //     });

// // //     docker.stdin.write(input);
// // //     docker.stdin.end();

// // //     docker.on("close", (code) => {
// // //       clearTimeout(timer);

// // //       if (killed) return reject(new Error("Time Limit Exceeded"));
// // //       if (code === 137) return reject(new Error("Memory Limit Exceeded"));
// // //       if (code !== 0) return reject(new Error("Runtime Error"));

// // //       resolve();
// // //     });
// // //   });
// // // };

// /***************************** Handle race condition and handle index ***********************************/
// // import readline from "readline";

// // const runDockerStream = (
// //   submissionsPath: string,
// //   image: string,
// //   command: string[],
// //   input: string,
// //   onLine: (line: string) => Promise<void>,
// // ): Promise<void> => {
// //   return new Promise((resolve, reject) => {
// //     const docker = spawn("docker", [
// //       "run",
// //       "--rm",
// //       "-i",
// //       "--memory=256m",
// //       "--cpus=0.5",
// //       "--pids-limit=50",
// //       "--network=none",
// //       "-v",
// //       `${submissionsPath}:/app`,
// //       image,
// //       ...command,
// //     ]);

// //     let killed = false;

// //     const timer = setTimeout(() => {
// //       killed = true;
// //       docker.kill("SIGKILL");
// //     }, TIME_LIMIT);

// //     const rl = readline.createInterface({
// //       input: docker.stdout,
// //       crlfDelay: Infinity,
// //     });

// //     rl.on("line", async (line) => {
// //       rl.pause();                 // ⛔ pause stream
// //       await onLine(line);         // ✅ process one line
// //       rl.resume();                // ▶ resume
// //     });

// //     docker.stderr.on("data", (data) => {
// //       console.error("stderr:", data.toString());
// //     });

// //     docker.stdin.write(input);
// //     docker.stdin.end();

// //     docker.on("close", (code) => {
// //       clearTimeout(timer);

// //       if (killed) return reject(new Error("Time Limit Exceeded"));
// //       if (code === 137) return reject(new Error("Memory Limit Exceeded"));
// //       if (code !== 0) return reject(new Error("Runtime Error"));

// //       resolve();
// //     });
// //   });
// // };


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////// 1 Container + 100 testcase then 100 exec //////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { spawn } from "child_process";
// import fs from "fs";
// import path from "path";
// import { languages } from "../config/languages.config.ts";
// import { redis } from "../store/redis.store.ts";
// import { fileURLToPath } from "url";

// const TIME_LIMIT = 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const processSubmission = async function (
//   jobId: string,
//   language: string,
//   code: string,
//   testCases: { input: string; expected: string }[],
// ) {
//     console.log("processSubmission called")
//   const config = languages[language];
//   if (!config) return;

//   await redis.set(
//     `job:${jobId}`,
//     JSON.stringify({ status: "running", results: [] }),
//   );

//   const submissionId = Date.now().toString();
//   const submissionsPath = path.join(__dirname, "../submissions", submissionId);
//   fs.mkdirSync(submissionsPath, { recursive: true });

//   const filename = `Main.${config.extension}`;
//   fs.writeFileSync(path.join(submissionsPath, filename), code);

//   const containerName = `runner_${submissionId}`;
//   let results: any[] = [];

//   try {
//     // 1️⃣ Start container (keep alive)
//     console.log("Before calling startContainer")
//     await startContainer(containerName, submissionsPath, config.image);

//     // 2️⃣ Compile once (if needed)
//     if (config.compile) {
//         try {
//             await execInContainer(containerName, config.compile.join(" "));
//         } catch (err: any) {
//             // 🛑 Compilation failed
//             console.log("Hello Compilation error")
//             await redis.set(
//             `job:${jobId}`,
//             JSON.stringify({
//                 status: "completed",
//                 results: [
//                 {
//                     status: "Compilation Error",
//                     message: err.message,
//                 },
//                 ],
//             }),
//             );

//             await stopContainer(containerName);
//             fs.rmSync(submissionsPath, { recursive: true, force: true });

//             return; // ⛔ STOP everything
//         }
//     }

//     const start = Date.now();

//     // 3️⃣ Run all test cases
//     for (let i = 0; i < testCases.length; i++) {
//       const test = testCases[i];
//       const start = Date.now();

//       try {
//         const output = await execWithInput(
//           containerName,
//           config.run.join(" "),
//           test!.input
//         );

//         const time = Date.now() - start;

//         const result = {
//           index: i,
//           status:
//             normalize(output) === normalize(test!.expected)
//               ? "Accepted"
//               : "Wrong Answer",
//           output: normalize(output),
//           expected: normalize(test!.expected),
//           time,
//         };

//         results.push(result);

//         // 🔥 Real-time update
//         await redis.set(
//           `job:${jobId}`,
//           JSON.stringify({ status: "running", results }),
//         );
//       } catch (err: any) {
//         // results.push({
//         //   index: i,
//         //   status: err.message,
//         //   output: "",
//         //   expected: test!.expected,
//         //   time: 0,
//         // });

//         // await redis.set(
//         //   `job:${jobId}`,
//         //   JSON.stringify({ status: "running", results }),
//         // );
//         console.log("Js compile err", err)
//         await redis.set(
//             `job:${jobId}`,
//             JSON.stringify({
//                 status: "completeddddddd",
//                 results: [
//                 {
//                     status: "Compilation Error",
//                     message: err.message,
//                 },
//                 ],
//             }),
//             );
//         return;
//       }
//     }

//     await redis.set(
//       `job:${jobId}`,
//       JSON.stringify({
//         status: "completed",
//         time: Date.now() - start,
//         results,
//       }),
//     );
//   } catch (err: any) {
//     await redis.set(
//       `job:${jobId}`,
//       JSON.stringify({
//         status: "failed",
//         error: err.message,
//       }),
//     );
//   } finally {
//     await stopContainer(containerName);
//     fs.rmSync(submissionsPath, { recursive: true, force: true });
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
//       "--name",
//       containerName,
//       "--memory=256m",
//       "--cpus=0.5",
//       "--pids-limit=50",
//       "--network=none",
//       "-v",
//       `${submissionsPath}:/app`,
//       "-w",
//       "/app",
//       image,
//       "sleep",
//       "300",
//     ]);

//     docker.on("close", (code) => {
//       if (code !== 0) reject(new Error("Container start failed"));
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
//       command,
//     ]);

//     let output = "";
//     let error = "";

//     docker.stdout.on("data", (data) => (output += data.toString()));
//     docker.stderr.on("data", (data) => (error += data.toString()));

//     console.log(error)

//     docker.on("close", (code) => {
//         console.log(code);
//       if (code !== 0) reject(new Error(error || "Runtime Error"));
//       else resolve(output);
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
//       runCommand,
//     ]);

//     let output = "";
//     let error = "";
//     let killed = false;

//     const timer = setTimeout(() => {
//       killed = true;
//       docker.kill("SIGKILL");
//     }, TIME_LIMIT);

//     docker.stdout.on("data", (data) => (output += data.toString()));
//     docker.stderr.on("data", (data) => (error += data.toString()));

//     docker.stdin.write(input);
//     docker.stdin.end();

//     docker.on("close", (code) => {
//       clearTimeout(timer);

//       if (killed) return reject(new Error("Time Limit Exceeded"));
//       if (code === 137) return reject(new Error("Memory Limit Exceeded"));
//       if (code !== 0) return reject(new Error(error || "Runtime Error"));

//       resolve(output);
//     });
//   });
// };

// const stopContainer = (containerName: string): Promise<void> => {
//   return new Promise((resolve) => {
//     spawn("docker", ["rm", "-f", containerName]).on("close", () => resolve());
//   });
// };

// const normalize = (str: string) => str.trim().replace(/\r/g, "");


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// 1 Container + Combined input and output with specific token //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* code-----
const fs = require('fs');\nconst INPUT_TOKEN = \"__JUDGE_INPUT_END__\";\nconst RESULT_START = \"__RESULT_START__\";\nconst RESULT_END = \"__RESULT_END__\";\n\nconst raw = fs.readFileSync(0, 'utf-8').trim();\nconst testCases = raw.split(INPUT_TOKEN);\n\nfor (let index = 0; index < testCases.length; index++) {\n    const lines = testCases[index].trim().split('\\n');\n    if (lines.length < 3) continue;\n\n    let pointer = 0;\n    const n = Number(lines[pointer++]);\n    const arr = lines[pointer++].split(' ').map(Number);\n    const x = Number(lines[pointer++]);\n\n    let first = -1, last = -1;\n\n    for (let i = 0; i < n; i++) {\n        if (arr[i] === x) {\n            if (first === -1) first = i;\n            last = i;\n        }\n    }\n\n    console.log(`${RESULT_START}${index}__`);\n    console.log(first + \" \" + last);\n    console.log(`${RESULT_END}${index}__`);\n}
*/

// import { spawn } from "child_process";
// import fs from "fs";
// import path from "path";
// import { languages } from "../config/languages.config.ts";
// import { fileURLToPath } from "url";
// import { Redis } from "ioredis";

// const redis = new Redis({ host: "127.0.0.1", port: 6379 });

// const TIME_LIMIT = 5000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const INPUT_TOKEN = "__JUDGE_INPUT_END__";

// export const processSubmission = async function (
//   jobId: string,
//   language: string,
//   code: string,
//   testCases: { input: string; expected: string }[],
// ) {
//   const config = languages[language];
//   if (!config) return;

//   await redis.set(`job:${jobId}`, JSON.stringify({
//     status: "running",
//     results: [],
//   }));

//   const submissionId = Date.now().toString();
//   const submissionsPath = path.join(__dirname, "../submissions", submissionId);
//   fs.mkdirSync(submissionsPath, { recursive: true });

//   // Write user code
//   const filename = `Main.${config.extension}`;
//   fs.writeFileSync(path.join(submissionsPath, filename), code);

//   let results: any[] = [];

//   try {
//     // ✅ Compile once (if required)
//     if (config.compile) {
//         try {
//             await runDocker(
//                 submissionsPath,
//                 config.image,
//                 config.compile
//             );
//         } catch(err: any){
//             await redis.set(`job:${jobId}`, JSON.stringify({
//                 status: "Compilation Error",
//                 error: err.message
//             }));
//             return;
//         }
//     }

//     // ✅ Combine input with token
//     const combinedInput =
//       testCases
//         .map(tc => tc.input.trim())
//         .join(`\n${INPUT_TOKEN}\n`) +
//       `\n${INPUT_TOKEN}\n`;

//     const start = Date.now();

//     // ✅ Run wrapper & stream output
//     await runDockerStream(
//       submissionsPath,
//       config.image,
//     //   ["sh", "judge-wrapper.sh"],
//       config.run,
//       combinedInput,
//       async (index, output) => {
//         const actual = normalize(output);
//         const expected = normalize(testCases[index]!.expected);

//         const result = {
//           index,
//           status: actual === expected ? "Accepted" : "Wrong Answer",
//           output: actual,
//           expected,
//           time: Date.now()
//         };

//         results[index] = result;

//         await redis.set(`job:${jobId}`, JSON.stringify({
//           status: "running",
//           results,
//         }));
//       }
//     );

//     await redis.set(`job:${jobId}`, JSON.stringify({
//       status: "completed",
//       time: Date.now() - start,
//       results,
//     }));

//   } catch (err: any) {
//     await redis.set(`job:${jobId}`, JSON.stringify({
//       status: "failed",
//       error: err.message
//     }));
//   } finally {
//     fs.rmSync(submissionsPath, { recursive: true, force: true });
//   }
// };

// const runDocker = (
//   submissionsPath: string,
//   image: string,
//   command: string[],
// ): Promise<void> => {

//   return new Promise((resolve, reject) => {
//     const docker = spawn("docker", [
//       "run",
//       "--rm",
//       "-i",
//       "--memory=256m",
//       "--cpus=0.5",
//       "--pids-limit=50",
//       "--network=none",
//       "-v",
//       `${submissionsPath}:/app`,
//       "-w",
//       "/app",
//       image,
//       ...command,
//     ]);

//     let error = "";

//     docker.stderr.on("data", d => error += d.toString());

//     docker.on("close", (code) => {
//       if (code !== 0) reject(new Error(error || "Compilation Error"));
//       else resolve();
//     });
//   });
// };

// const runDockerStream = (
//   submissionsPath: string,
//   image: string,
//   command: string[],
//   input: string,
//   onResult: (index: number, output: string) => Promise<void>,
// ): Promise<void> => {

//   return new Promise((resolve, reject) => {

//     const docker = spawn("docker", [
//       "run",
//       "--rm",   
//       "-i",
//       "--memory=256m",
//       "--cpus=0.5",
//       "--pids-limit=50",
//       "--network=none",
//       "-v",
//       `${submissionsPath}:/app`,
//       "-w",
//       "/app",
//       image,
//       ...command,
//     ]);

//     let buffer = "";
//     let killed = false;

//     const timer = setTimeout(() => {
//       killed = true;
//       docker.kill("SIGKILL");
//     }, TIME_LIMIT);

//     // docker.stdout.on("data", async (data) => {
//     //   buffer += data.toString();

//     //   while (true) {
//     //     // const startMatch = buffer.match(/__JUDGE_START__(\d+)__/);
//     //     // const endMatch = buffer.match(/__JUDGE_END__(\d+)__/);
//     //     const startMatch = buffer.match(/__RESULT_START__(\d+)__/);
//     //     const endMatch = buffer.match(/__RESULT_END__(\d+)__/);

//     //     if (!startMatch || !endMatch) break;

//     //     const index = Number(startMatch[1]);

//     //     const startPos = buffer.indexOf(startMatch[0]);
//     //     const endPos = buffer.indexOf(endMatch[0]);

//     //     if (endPos < startPos) break;

//     //     const output = buffer.substring(
//     //       startPos + startMatch[0].length,
//     //       endPos
//     //     );

//     //     buffer = buffer.slice(endPos + endMatch[0].length);

//     //     await onResult(index, output);
//     //   }
//     // });

//     docker.stdout.on("data", async (data) => {
//         buffer += data.toString();

//         while (true) {

//             const startIndex = buffer.indexOf("__RESULT_START__");
//             if (startIndex === -1) break;

//             const startMatch = buffer
//             .slice(startIndex)
//             .match(/^__RESULT_START__(\d+)__/);

//             if (!startMatch) break;

//             const index = Number(startMatch[1]);
//             const startToken = startMatch[0];

//             const contentStart =
//             startIndex + startToken.length;

//             const endToken = `__RESULT_END__${index}__`;
//             const endIndex = buffer.indexOf(endToken, contentStart);

//             if (endIndex === -1) break; // wait for full block

//             const output = buffer.slice(contentStart, endIndex);

//             // remove processed part
//             buffer = buffer.slice(endIndex + endToken.length);

//             await onResult(index, output);
//         }
//     });

//     docker.stderr.on("data", (data) => {
//       console.error("stderr:", data.toString());
//     });

//     docker.stdin.write(input);
//     docker.stdin.end();

//     docker.on("close", (code) => {
//       clearTimeout(timer);
//       if (killed) return reject(new Error("Time Limit Exceeded"));
//       if (code === 137) return reject(new Error("Memory Limit Exceeded"));
//       if (code === 139) return reject(new Error("Runtime Error (Segmentation Fault) "));
//       if (code !== 0) return reject(new Error("Runtime Error"));

//       resolve();
//     });
//   });
// };

// const normalize = (str: string) =>
//   str.trim().replace(/\r/g, "");