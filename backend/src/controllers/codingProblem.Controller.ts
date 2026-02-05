import type { Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import type { CodingProblemData } from "../types/controller/codingProblemController.type.ts";
import { 
    createCodingProblemService, 
    deleteCodingProblemService, 
    getAllCodingProblemsService, 
    getCodingProblemByIdService, 
    updateCodingProblemService
} from "../services/codingProblem.service.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";

export const createCodingProblem = async (req: AuthRequest, res: Response) => {
    try {
        const admin = req.user;

        if(!admin || !admin.userId){
            res.badRequest(ERROR_MESSAGES.USER_UNAUTHORIZED);
        }

        const input = req.allParams as CodingProblemData;

        if(!input){
            res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
        }

        const data = await createCodingProblemService(input, admin!.userId);
        res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_CREATED);

    } catch (err:any) {
        res.badRequest(err.message);
    }
};

export const getCodingProblemById = async (req: AuthRequest, res: Response) => {
    try{
        const admin = req.user;

        if(!admin || !admin.userId){
            res.badRequest(ERROR_MESSAGES.USER_UNAUTHORIZED);
        }

        const { id } = req.allParams;

        if (!id) {
            res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_ID_MISSING);
        }

        const data = await getCodingProblemByIdService(id);
        res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_FIND);

    } catch(err: any) {
        res.badRequest(err.message);
    }
};

export const getAllCodingProblems = async (req: AuthRequest, res: Response) => {
    try {
        const admin = req.user;

        if(!admin || !admin.userId ){
            res.badRequest(ERROR_MESSAGES.USER_UNAUTHORIZED);
        }

        const data = await getAllCodingProblemsService();

        res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_LIST_FETCHED);
    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const updateCodingProblem = async (req: AuthRequest, res: Response) => {
    try {
        const admin = req.user;

        if(!admin || !admin.userId ){
            res.badRequest(ERROR_MESSAGES.USER_UNAUTHORIZED);
        }

        const updatedInput = req.allParams as CodingProblemData;
        const { id } = req.allParams;

        if(!updatedInput){
            res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
        }

        const data = await updateCodingProblemService(id, updatedInput);

        res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_UPDATED);
    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const deleteCodingProblem = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.allParams;

        if (!id) {
            res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_ID_MISSING);
        }

        const data = await deleteCodingProblemService(id);
        res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_DELETED);

    } catch (err: any) {
        res.badRequest(err.message);
    }
};