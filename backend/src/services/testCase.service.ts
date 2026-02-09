import type { InsertManyResult } from "mongoose";
import { ERROR_MESSAGES } from "../constants/index.ts";
import { CodingProblem } from "../models/coding_problem.model.ts";
import { TestCase } from "../models/test_case.model.ts";
import type { TestCaseData } from "../types/controller/testCaseData.types.ts";
import { getCodingProblemByIdService } from "./codingProblem.service.ts";
import type { TestCaseDocument } from "../types/model/test_case.document.ts";

export const createTestCaseService = async (input: TestCaseData) => {
    const testCase = await TestCase.create({ ...input });

    if(!testCase){
        throw new Error(ERROR_MESSAGES.TEST_CASE_CREATE_FAILED);
    }

    return { testCase };
};

export const getAllTestCasesByProblemIdService = async (problemId: string) => {
    const problem = await getCodingProblemByIdService(problemId);

    const data = await TestCase.findActive({problem_id: problemId}, {input: 1, expected_output: 1, _id: 0});

    if(!data.length){
        throw new Error(ERROR_MESSAGES.TEST_CASES_NOT_FOUND);
    }

    return { data };
};

export const updateTestCaseService = async (id: string, input: TestCaseData) => {
    const testCase = await TestCase.updateOne({ id }, { ...input });

    if(!testCase.matchedCount){
        throw new Error(ERROR_MESSAGES.TEST_CASE_UPDATE_FAILED);
    }

    return { testCase };
};

export const deleteTestCaseService = async (id: string) => {
    const testCase = await TestCase.softDelete({ id });

    if(!testCase.matchedCount){
        throw new Error(ERROR_MESSAGES.TEST_CASE_DELETE_FAILED);
    }

    return { testCase };
};

export const createManyTestCasesService = async (input: TestCaseData[]) => {
    const testCases = await TestCase.insertMany(input);

    if(!testCases){
        throw new Error(ERROR_MESSAGES.TEST_CASE_CREATE_FAILED);
    }

    return { testCases };
}