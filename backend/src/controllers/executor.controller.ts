import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import type { CodeExecutionData, WorkerResponse } from "../types/controller/executorData.types.ts";
import { ERROR_MESSAGES } from "../constants/index.ts";
// import { submissionQueue } from "../queue/submission.queue.ts";
// import { redis } from "../store/redis.store.ts";
import { getAllTestCasesByProblemIdService } from "../services/testCase.service.ts";
import { processSubmission } from "../services/executor.service.ts";
import { createSubmissionService } from "../services/submission.service.ts";

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

        const { assignedProblemId, problemId, language, code } = input;

        if(!problemId) {
            return res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_ID_REQUIRED);
        }

        const { testCases } = await getAllTestCasesByProblemIdService(problemId);
        const formattedTestCases = testCases.map(tc => ({
            testCaseId: tc.id,
            input: tc.input,
            expected: tc.expected_output
        }));

        // const job = await submissionQueue.add("submission", {
        //     language,
        //     code,
        //     testCases: formattedTestCases
        // });
        
        // const response: WorkerResponse = {
        //     status: "Pending",
        // };
    
        // await redis.set(`job:${job.id}`, JSON.stringify(response));

        // res.ok({ jobId: job.id }); 

        const data = await processSubmission({
            language,
            code,
            testCases: formattedTestCases
        });
        
        if(data.results) {
            data.results = data.results.map((result: any) => ({
                index: result.index,
                testCaseId: result.testCaseId,
                status: result.status,
                time: result.time,
            }));
        }

        const totalTestCases = testCases ? testCases.length : 0;
        const passedTestCases = data.results ? data.results.filter((r: any) => r.status === "Accepted").length : 0;

        if(!data.error){
            if(totalTestCases === passedTestCases && totalTestCases > 0) {
                data.resultStatus = "Accepted";
            } else if(passedTestCases > 0) {
                data.resultStatus = "Partially Accepted";
            } else {
                data.resultStatus = "Failed";
            }
        }

        if(!assignedProblemId) {
            return res.badRequest(ERROR_MESSAGES.ASSIGNED_PROBLEM_ID_REQUIRED);
        }

        const submission = await createSubmissionService({
            assigned_problem_id: assignedProblemId,
            language,
            source_code: code,
            submitted_at: new Date(),
            total_test_cases: totalTestCases,
            passed_test_cases: passedTestCases,
            status: data.resultStatus || data.error || data.status,
            execution_time: data.time ? `${data.time} ms` : "",
        });

        if(data.error) {
            res.ok(data);
        } else {
            res.ok({
                totalTestCases,
                passedTestCases,
                ...data,
            });
        }
    } catch (err: any) {
        next(err);
    }
};