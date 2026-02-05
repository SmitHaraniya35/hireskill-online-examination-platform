import type { Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { 
    createTestCaseService,
    getAllTestCasesByProblemIdService,
    updateTestCaseService,
    deleteTestCaseService
} from "../services/testCase.service.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import type { TestCaseData } from "../types/controller/testCaseData.types.ts";

export const createTestCase = async (req: AuthRequest, res: Response) => {
    try {
        const input = req.allParams as TestCaseData;

        if(!input){
            res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
        }

        const data = await createTestCaseService(input);
        res.ok(data, SUCCESS_MESSAGES.TEST_CASES_CREATED);
    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const getAllTestCasesByProblemId = async (req: AuthRequest, res: Response) => {
    try {
        const { problemId } = req.allParams;

        if(!problemId) {
            res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_ID_MISSING);
        }

        const data = await getAllTestCasesByProblemIdService(problemId);
        res.ok(data, SUCCESS_MESSAGES.TEST_CASE_LIST_FETCHED);

    } catch(err: any){
        res.badRequest(err.message);
    }
};

export const updateTestCase = async (req: AuthRequest, res: Response) => {
    try {
        const input = req.allParams as TestCaseData;
        const { id } = req.allParams;

        if(!id){
            res.notFound(ERROR_MESSAGES.TEST_CASE_ID_MISSING);
        }

        const data = await updateTestCaseService(id, input);
        res.ok(data, SUCCESS_MESSAGES.TEST_CASE_UPDATED);

    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const deleteTestCase = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.allParams;

        if(!id){
            res.notFound(ERROR_MESSAGES.TEST_CASE_ID_MISSING);
        }

        const data = await deleteTestCaseService(id);
        res.ok(data, SUCCESS_MESSAGES.TEST_CASE_DELETED);

    } catch (err: any) {
        res.badRequest(err.message);
    }
};
