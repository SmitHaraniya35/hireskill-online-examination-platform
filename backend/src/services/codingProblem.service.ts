import { ERROR_MESSAGES } from "../constants/index.ts";
import { CodingProblem } from "../models/coding_problem.model.ts";
import { User } from "../models/user.model.ts";
import type { CodingProblemData, CodingProblemWithTestCasesData } from "../types/controller/codingProblemData.types.ts";
import type { TestCaseData } from "../types/controller/testCaseData.types.ts";
import { createManyTestCasesService, createTestCaseService, updateTestCaseService } from "./testCase.service.ts";

export const createCodingProblemService = async (input: CodingProblemData, adminId: string) => {
    const admin = await User.findOneActive({ id: adminId });

    if(!admin){
        throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);
    }

    const codingProblem = await CodingProblem.create({ ...input, created_by: adminId });

    if(!codingProblem){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_CREATE_FAILED);
    }

    return { codingProblem };
};

export const getCodingProblemByIdService = async (id: string) => {
    const codingProblem = await CodingProblem.findByIdActive(id);

    if(!codingProblem){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND);
    }

    return { codingProblem }

};

export const getAllCodingProblemsService = async () => {
    const codingProblemList = await CodingProblem.findActive();

    if(!codingProblemList){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_LIST_NOT_FOUND);
    }

    return { codingProblemList };
};

export const updateCodingProblemService = async (id: string, updatedInput: CodingProblemData) => {
    const codingProblem = await CodingProblem.updateOne({ id }, { ...updatedInput });

    if(!codingProblem){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_UPDATE_FAILED);
    }

    return { codingProblem };
};

export const deleteCodingProblemService = async (id: string) => {
    const codingProblem = await CodingProblem.softDelete({ id });

    if(!codingProblem){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_DELETE_FAILED);
    }

    return { codingProblem };
};

export const createCodingProblemWithTestCasesService = async (input: CodingProblemWithTestCasesData, adminId: string) => {
    const admin = await User.findOneActive({ id: adminId });

    if(!admin){
        throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);
    }

    const { testCases, ...codeWithoutTestCase }  = input;
    const sampleTestCase = testCases.find((item) => {
        if(!item.is_hidden){
            return item;
        }
    });

    console.log(sampleTestCase)

    const codeInput = {
        ...codeWithoutTestCase,
        sample_input: sampleTestCase!.input,
        sample_output: sampleTestCase!.expected_output,
        created_by: adminId
    };

    console.log(codeInput)

    const codingProblem = await CodingProblem.create({ ...codeInput });
    if(!codingProblem){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_CREATE_FAILED);
    }
    await codingProblem.save();

    const { id: problem_id }  = codingProblem;

    const hiddenTestCases = testCases.filter((item) => {
        if(item.is_hidden){
            return item;
        }
    });

    const inputTestCases: TestCaseData[] = hiddenTestCases.map((item) => {
        return { problem_id, ...item };
    });

    const data = await createManyTestCasesService(inputTestCases)

    return { codingProblem, data };
};

export const selectRandomProblemService = async () => {
    const problems = await CodingProblem.find();

    if(!problems.length){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND);
    }

    const len = problems.length;
    const index = Math.floor(Math.random() * len);
    
    return problems[index];
};

export const getCodingProblemWithTestCasesService = async (id: string) => {
    const codingProblemWithTestCases = await CodingProblem.findByIdActive(
        id, 
        { _id: 0, createdAt: 0, deletedAt: 0, updatedAt: 0, isDeleted: 0}
    ).populate({
        path: "testcases",
        match: { isDeleted: false },
        select: "id input expected_output is_hidden -_id"
    });

    if(!codingProblemWithTestCases){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND);
    }

    return { codingProblemWithTestCases }
};

export const updateCodingProblemWithTestCasesService = async (input: CodingProblemWithTestCasesData, adminId: string) => {
    const admin = await User.findOneActive({ id: adminId });

    if(!admin){
        throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);
    }

    const problem_id = input.id;
    if(!problem_id){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_ID_MISSING);
    }

    const { testCases, ...codeWithoutTestCase }  = input;
    const sampleTestCase = testCases.find((item) => {
        if(!item.is_hidden){
            return item;
        }
    });

    const codeInput = {
        ...codeWithoutTestCase,
        sample_input: sampleTestCase!.input,
        sample_output: sampleTestCase!.expected_output,
    };

    const codingProblem = await CodingProblem.findOneAndUpdate({ id: problem_id }, { ...codeInput });
    if(!codingProblem){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_UPDATE_FAILED);
    }
    await codingProblem.save();

    testCases.map(async (testcase) => {
        if(testcase.id){
            await updateTestCaseService(testcase.id, { problem_id, ...testcase });
        } else {
            await createTestCaseService({ problem_id, ...testcase });
        }
    });

    const data = await getCodingProblemWithTestCasesService(problem_id);

    return { updatedCodingProblem: data }
}