import { ERROR_MESSAGES } from "../constants/index.ts";
import { Test } from "../models/test.model.ts";
import { User } from "../models/user.model.ts";
import { generateUniqueTestToken } from "../utils/helper.utils.ts";
import { selectRandomProblemService } from "./codingProblem.service.ts";
import { createStudentAttemptService } from "./student_attempt.service.ts";

export const createTestService = async (title: string, duration_minutes: number, expiration_at: Date, adminId: string) => {
    const admin = await User.findByIdActive(adminId);

    if(!admin){
        throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);
    }

    const unique_token = generateUniqueTestToken();

    const test = await Test.create({
        title,
        unique_token,
        expiration_at,
        duration_minutes,
        is_active: true,
        created_by: admin.id
    });

    await test.save();

    return { test };
};

export const getTestByIdService = async (testId: string) => {
    const test = await Test.findByIdActive(testId, { 
        id: 1, 
        title: 1, 
        expiration_at: 1, 
        duration_minutes: 1, 
        unique_token: 1, 
        _id: 0 
    });

    if(!test){
        throw new Error(ERROR_MESSAGES.TEST_NOT_FOUND)
    }

    return { test };
};

export const getAllTestService = async () => {
    const testList = await Test.findActive({},{ 
        id: 1, 
        title: 1, 
        expiration_at: 1, 
        duration_minutes: 1, 
        unique_token: 1, 
        _id: 0 
    });

    if(!testList){
        throw new Error(ERROR_MESSAGES.TEST_LIST_NOT_FOUND);
    }

    return { testList };
};

export const updateTestService = async (id: string, title: string, duration_minutes: number, expiration_at: Date) => {
    const test = await Test.updateOneByFilter({ id }, {
        title,
        duration_minutes,
        expiration_at
    });

    if(!test){
        throw new Error(ERROR_MESSAGES.TEST_UPDATE_FAILED);
    }

    return { test };
};

export const deleteTestService = async (id: string) => {
    const test = await Test.softDelete({ id });

    if(!test){
        throw new Error(ERROR_MESSAGES.TEST_DELETE_FAILED);
    }

    return { test };
};

export const startTestService = async (test_id: string, student_id: string) => {
    const problem = await selectRandomProblemService();
    if(!problem && !problem!.id){
      throw new Error(ERROR_MESSAGES.CODING_PROBLEM_NOT_FOUND);
    }
    
    await createStudentAttemptService(test_id, problem!.id, student_id);
    
    return { problemId: problem!.id };
}