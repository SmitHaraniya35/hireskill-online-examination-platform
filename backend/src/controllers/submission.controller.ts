import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import type { SubmitCodeRequest, Judge0Submission, Judge0BatchSubmission } from "../types/controller/submissionData.types.ts";
import { executeAllHiddentTestCases, executeCode, getJudge0SubmissionById } from "../services/judge0.service.ts";
import { getAllTestCasesByProblemIdService } from "../services/testCase.service.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import type { TestCaseDocument } from "../types/model/test_case.document.ts";

export const runCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const input = req.allParams as Judge0Submission;
        if(!input) {
            return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
        }

        const data = await executeCode(input);
        res.ok(data, SUCCESS_MESSAGES.CODE_EXECUTED)
    } catch (err: any) {
        next(err);
    }
};

export const submitCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const input = req.allParams as SubmitCodeRequest;
        if(!input){
            return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
        }

        const { source_code, language_id, problem_id } = input;
        const inputs: Judge0BatchSubmission = {
            submissions: []
        }; 

        const { testCases: testCasesList } = (await getAllTestCasesByProblemIdService(problem_id));

        const testCasesIdList: Array<string> = [] 

        for (let i = 0; i < testCasesList.length; i++) {
            let obj = {
                source_code: Buffer.from(source_code, "utf8").toString("base64"),
                language_id,
                stdin: Buffer.from(testCasesList[i]?.input!, "utf-8").toString("base64"),
                expected_output: Buffer.from(testCasesList[i]?.expected_output!, "utf-8").toString("base64")
            } as Judge0Submission;

            inputs.submissions.push(obj);
            testCasesIdList.push(testCasesList[i]!.id);
        }

        const data = await executeAllHiddentTestCases(inputs, testCasesIdList);
        res.ok(data, SUCCESS_MESSAGES.TEST_CASES_EXECUTED);
    } catch (err: any) {
        next(err);
    }
};

export const fetchOutput = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { submissionId } = req.allParams;
        if(!submissionId){
            return res.badRequest(ERROR_MESSAGES.JUDGE0_SUBMISSION_ID_REQUIRED);
        }

        const data = await getJudge0SubmissionById(submissionId);
        res.ok(data, SUCCESS_MESSAGES.JUDGE0_SUBMISSION_RETRIEVED); 
    } catch (err: any) {
        next(err);
    }
};
