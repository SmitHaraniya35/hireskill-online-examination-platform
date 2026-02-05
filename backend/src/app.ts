import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import responseMiddleware from "./middlewares/response.middleware.ts";
import adminRoutes from "./routes/auth.routes.ts";
import testRoutes from "./routes/test.routes.ts";
import codingProblemRoutes from "./routes/codingProblem.routes.ts";

const app = express();

// Security & core
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// we will see this later...
// app.use(helmet());

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

export default app;


