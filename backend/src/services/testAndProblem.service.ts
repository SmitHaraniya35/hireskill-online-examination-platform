import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { Test } from "../models/test.model.ts";
import { TestAndProblem } from "../models/test_and_problem.model.ts";
import { HttpError } from "../utils/httpError.utils.ts";

export const createTestAndProblemsByTestIdService = async (codingProblemIdList: string[], testId: string) => {
    const test = await Test.findByIdActive(testId);
    if(!test) {
        throw new HttpError(
            ERROR_MESSAGES.TEST_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        )
    }

    const testAndProblems = await TestAndProblem.insertMany(
        codingProblemIdList.map((codingProblemId) => ({
            test_id: testId,
            coding_problem_id: codingProblemId,
        }))
    );
    
    return { testAndProblems };
};

export const getCodingProblemsByTestIdService = async (test_id: string) => {
    const codingProblems = await TestAndProblem.findActive({ test_id }, { coding_problem_id: 1, _id: 0 });

    if(!codingProblems) {
        throw new HttpError(
            ERROR_MESSAGES.TEST_AND_PROBLEMS_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        )
    }

    return { codingProblems };
};

export const deleteTestAndProblemsByTestIdService = async (codingProblemIdList: string[], testId: string) => {
    const test = await Test.findByIdActive(testId);
    if(!test) {
        throw new HttpError(
            ERROR_MESSAGES.TEST_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        )
    }

    const testAndProblems = await TestAndProblem.deleteMany({
        test_id: testId,
        coding_problem_id: { $in: codingProblemIdList }
    });

    if(!testAndProblems){
        throw new HttpError(
            ERROR_MESSAGES.TEST_AND_PROBLEMS_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        )
    }
    
    return { testAndProblems };
};