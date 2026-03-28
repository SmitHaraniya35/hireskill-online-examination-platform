import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { deleteCodingProblemTemplateByIdService } from "../services/codingProblemTemplate.service.ts";
import { ERROR_MESSAGES, HttpStatusCode, SUCCESS_MESSAGES } from "../constants/index.ts";

export const deleteCodingProblemTemplateById = async (
    req: AuthRequest, 
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.allParams;
        if(!id) {
            return res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_TEMPLATE_ID_REQUIRED);
        }
        const data = await deleteCodingProblemTemplateByIdService(id);
        res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_DELETED)
    } catch (err: any) {
        next(err);
    }
};