import { ERROR_MESSAGES } from "../constants/index.ts";
import { CodingProblem } from "../models/coding_problem.document.ts";
import { User } from "../models/user.model.ts";
import type { CodingProblemData } from "../types/controller/codingProblemController.type.ts";

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
    // const admin = await User.findOneActive({ id: adminId });

    // if(!admin){
    //     throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);
    // }

    const codingProblem = await CodingProblem.updateOne({ id }, { ...updatedInput });

    if(!codingProblem){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_UPDATE_FAILED);
    }

    return { codingProblem };
};
export const deleteCodingProblemService = async (id: string) => {
    // const admin = await User.findOneActive({ id: adminId });

    // if(!admin){
    //     throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);
    // }

    const codingProblem = await CodingProblem.softDelete({ id });

    if(!codingProblem){
        throw new Error(ERROR_MESSAGES.CODING_PROBLEM_DELETE_FAILED);
    }

    return { codingProblem };
};