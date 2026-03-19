import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import type { CodeExecutionData } from "../types/controller/executorData.types.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
// import { submissionQueue } from "../queue/submission.queue.ts";
// import { redis } from "../store/redis.store.ts";
import { processSubmission, submitCodeService } from "../services/executor.service.ts";

export const runCode = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const input = req.allParams as CodeExecutionData;
        if(!input) {
            return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
        }

        const { language, code, testCases } = input;

        const data = await processSubmission(input);

        // const job = await submissionQueue.add("submission", {
        //     language,
        //     code,
        //     testCases
        // });
        // const response: WorkerResponse = {
        //     status: "Pending",
        // };
    
        // await redis.set(`job:${job.id}`, JSON.stringify(response));

        // res.ok({ jobId: job.id });
        res.ok(data);
    } catch (err: any) {
        next(err);
    }
};

export const submitCode = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const input = req.allParams as CodeExecutionData;
        if(!input) {
            return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
        }

        const result = await submitCodeService(input);
        return res.ok(result, SUCCESS_MESSAGES.CODE_EXECUTED);
    } catch (err: any) {
        next(err);
    }
};