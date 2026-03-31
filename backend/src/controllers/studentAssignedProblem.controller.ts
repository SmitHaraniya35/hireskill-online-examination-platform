import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import type { StudentAssingProblemDraftData } from "../types/controller/studentAssignedProblemData.types.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import { attemptedStudentAssignedProblemService, saveStudentAssignedProblemDraftService, submittedStudentAssignedProblemService } from "../services/studentAssignedProblem.service.ts";

export const saveStudentAssignedProblemDraft = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const input = req.allParams as StudentAssingProblemDraftData;
        if(!input) {
            return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
        }

        const data = await saveStudentAssignedProblemDraftService(input);
        res.ok(data, SUCCESS_MESSAGES.STUDENT_ASSIGNED_PROBLEM_SAVE_DRAFT_SUCCESS);
    } catch (err: any) {
        next(err);
    }
};

export const attemptedStudentAssignedProblem = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.allParams;
        if(!id) {
            return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
        }

        const data = await attemptedStudentAssignedProblemService(id);
        res.ok(data, SUCCESS_MESSAGES.STUDENT_ASSIGNED_PROBLEM_ATTEMPTED_SUCCESS);
    } catch (err: any) {
        next(err);
    }
};

export const submittedStudentAssignedProblem = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.allParams;
        if(!id) {
            return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
        }

        const data = await submittedStudentAssignedProblemService(id);
        res.ok(data, SUCCESS_MESSAGES.STUDENT_ASSIGNED_PROBLEM_SUBMITTED_SUCCESS);
    } catch (err: any) {
        next(err);
    }
};