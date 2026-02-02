import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import responseMiddleware from "./middlewares/response.middleware.ts";

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


app.use("/", (req, res, next) => {
    res.send("Hello Wolrd");
})

export default app;


