import mongoose from "mongoose";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";

export const connectDB = async (): Promise<void> => {
    try{
        const URL = process.env.MONGO_DB_URL;
        await mongoose.connect(URL as string);
        console.log(SUCCESS_MESSAGES.MONGO_DB_CONNECTION_SUCC);
    } catch (err) {
        console.error(ERROR_MESSAGES.MONGO_DB_CONNECTION_FAIL);
        process.exit(1);
    }
};