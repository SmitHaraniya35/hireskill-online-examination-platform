import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { deleteCodingProblemTemplateByIdService } from "../services/codingProblemTemplate.service.ts";
import { ERROR_MESSAGES, HttpStatusCode, SUCCESS_MESSAGES } from "../constants/index.ts";
import { HttpError } from "../utils/httpError.utils.ts";

export const deleteCodingProblemTemplateById = async (
    req: AuthRequest, 
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.allParams;
        if(!id) {
            throw new HttpError(
                ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
                HttpStatusCode.BAD_REQUEST
            );
        }
        const data = await deleteCodingProblemTemplateByIdService(id);
        res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_DELETED)
    } catch (err: any) {
        next(err);
    }
};