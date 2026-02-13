import mongoose from "mongoose";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";

export const connectDB = async (): Promise<void> => {
    try{
        const URL = process.env.MONGO_DB_URL;
        await mongoose.connect(URL as string);
        console.log(SUCCESS_MESSAGES.DATABASE_CONNECTED);
    } catch (err) {
        console.error(ERROR_MESSAGES.DATABASE_CONNECTION_FAILED);
        process.exit(1);
    }
};