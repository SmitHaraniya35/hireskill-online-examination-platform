import { ERROR_MESSAGES } from "../constants/index.ts";
import { Test } from "../models/test.model.ts";
import { User } from "../models/user.model.ts";
import { generateUniqueTestToken } from "../utils/helper.utils.ts";

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
        is_active: false,
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

export const validateTestLinkService = async (slug: string) => {
    const data = await Test.findOneActive({ unique_token: slug });

    if(!data){
        throw new Error(ERROR_MESSAGES.INVALID_TEST_LINK);
    }

    const currentDateTime = new Date();
    
    if(currentDateTime > data.expiration_at || !data.is_active){
        throw new Error(ERROR_MESSAGES.EXPIRED_TEST_LINK);
    }

    return { data };
}