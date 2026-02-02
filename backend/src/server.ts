import http from "http";
import dotenv from "dotenv";
import app from "./app.ts";
import { connectDB } from "./config/db.config.ts";

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT;

connectDB();

server.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});

