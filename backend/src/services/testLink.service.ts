import { ERROR_MESSAGES } from "../constants/index.ts";
import { TestLink } from "../models/test_link.model.ts";
import { User } from "../models/user.model.ts";
import { generateUniqueTestToken } from "../utils/helper.utils.ts";

export const createTestLinkService = async (title: string, duration_minutes: number, expiration_at: Date, adminId: string) => {
    const admin = await User.findByIdActive(adminId);

    if(!admin){
        throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);
    }

    const unique_token = generateUniqueTestToken();

    const test = await TestLink.create({
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

export const getTestLinkByIdService = async (testLinkId: string) => {
    const test = await TestLink.findByIdActive(testLinkId, { 
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

export const getAllTestLinkService = async () => {
    const testList = await TestLink.findActive({},{ 
        id: 1, 
        title: 1, 
        expiration_at: 1, 
        duration_minutes: 1, 
        unique_token: 1, 
        _id: 0 
    });

    if(!testList){
        throw new Error(ERROR_MESSAGES.TESTLIST_NOT_FOUND);
    }

    return { testList };
};

export const updateTestLinkService = async (id: string, title: string, duration_minutes: number, expiration_at: Date) => {
    const test = await TestLink.updateOneByFilter({ id }, {
        title,
        duration_minutes,
        expiration_at
    });

    if(!test){
        throw new Error(ERROR_MESSAGES.TEST_UPDATE_FAILED);
    }

    return { test };
};

export const deleteTestLinkService = async (id: string) => {
    const test = await TestLink.softDelete({ id });

    if(!test){
        throw new Error(ERROR_MESSAGES.TEST_DELETE_FAILED);
    }

    return { test };
};