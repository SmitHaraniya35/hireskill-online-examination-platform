import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import responseMiddleware from "./middlewares/response.middleware.ts";
import adminRoutes from "./routes/auth.routes.ts";
import testRoutes from "./routes/test.routes.ts";
import codingProblemRoutes from "./routes/codingProblem.routes.ts";
import testCaseRoutes from "./routes/testCase.routes.ts";
import studentRoutes from "./routes/student.routes.ts";
import submissionRoutes from "./routes/submission.routes.ts";
import studentAttemptRoutes from "./routes/studentAttempt.routes.ts";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.ts";
// import { validateApiKey } from "./middlewares/apikey.middleware.ts";
// import { submissionQueue } from "./queue/submission.queue.ts";
// import { redis } from "./store/redis.store.ts";

const app = express();

// Security & core
app.use(cors({
    origin: "http://192.168.0.106:5173",
    credentials: true
}));

// we will see this later...
// app.use(helmet());
// app.use(validateApiKey);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Custom Response Middleware
app.use(responseMiddleware);

// Add all routes
app.use("/api/auth", adminRoutes);
app.use("/api/test", testRoutes);
app.use("/api/coding-problem", codingProblemRoutes);
app.use("/api/test-case", testCaseRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/student-attempt", studentAttemptRoutes);

// app.post("/api/submit", async (req, res) => {
//   try {
//     const { language, code, testCases } = req.body;

//     const job = await submissionQueue.add("submission", {
//       language,
//       code,
//       testCases,
//     });

//     await redis.set(
//       `job:${job.id}`,
//       JSON.stringify({
//         status: "pending",
//         results: [],
//       }),
//     );

//     res.json({ jobId: job.id });
//   } catch (err: any) {
//     console.log(err);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

// app.get("/api/result/:jobId", async (req, res) => {
//   const data = await redis.get(`job:${req.params.jobId}`);
//   if (!data) return res.status(404).json({ message: "Not found" });

//   res.json(JSON.parse(data));
// });

// Custom Error Middleware
app.use(errorHandlerMiddleware);

export default app;


