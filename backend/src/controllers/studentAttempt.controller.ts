import type { Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import { deleteStudentAttemptService, getStudentAttemptsDetailsByTestIdService } from "../services/student_attempt.service.ts";

export const deleteStudentAttempt = async (req: AuthRequest, res: Response) => {
    try {
        const admin = req.user;
        if (!admin) {
          res.unauthorized(ERROR_MESSAGES.USER_UNAUTHORIZED);
        }

        const { id } = req.allParams;
        if (!id) {
            res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_ID_MISSING);
        }
        
        const data = await deleteStudentAttemptService(id);
        res.ok(data, SUCCESS_MESSAGES.STUDENT_ATTEMPT_DELETED);
    } catch (err: any) {
        res.badRequest(err.message);
    }
};

export const getStudentAttemptsDetailsByTestId = async (req: AuthRequest, res: Response) => {
    try {
        const { testId } = req.allParams;

        if(!testId){
            return res.notFound(ERROR_MESSAGES.TEST_ID_MISSING);
        }

        const data = await getStudentAttemptsDetailsByTestIdService(testId);
        res.ok(data, SUCCESS_MESSAGES.STUDENT_ATTEMPTS_OF_TEST_FETCHED);

    } catch (err: any) {
        res.badRequest(err.message);
    }
};

