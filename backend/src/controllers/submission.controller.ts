import type { Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import type { SubmitCodeRequest, Judge0Submission, Judge0BatchSubmission } from "../types/controller/submissionData.types.ts";
import { executeAllHiddentTestCases, executeCode } from "../services/judge0.service.ts";
import { getAllTestCasesByProblemIdService } from "../services/testCase.service.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";

export const runCode = async (req: AuthRequest, res: Response) => {
    try {
        const input = req.allParams as Judge0Submission;
        if(!input) {
            res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
        }
        const data = await executeCode(input);
        res.ok(data, SUCCESS_MESSAGES.CODE_EXECUTED)
    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const submitCode = async (req: AuthRequest, res: Response) => {
    try {
        const { source_code, language_id, problem_id } = req.allParams as SubmitCodeRequest;
        const inputs: Judge0BatchSubmission = {
            submissions: []
        };

        const { data: testCasesList } = await getAllTestCasesByProblemIdService(problem_id);

        for (let i = 0; i < testCasesList.length; i++) {
            let obj = {
                source_code,
                language_id,
                stdin: testCasesList[i]?.input,
                expected_output: testCasesList[i]?.expected_output
            } as Judge0Submission;

            inputs.submissions.push(obj);
        }

        const data = await executeAllHiddentTestCases(inputs);
        res.ok(data, SUCCESS_MESSAGES.TESTCASES_EXECUTED);
    } catch (err: any) {
        res.badRequest(err.message);
    }
};

