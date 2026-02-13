import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import {
  deleteStudentAttemptService,
  getStudentAttemptsDetailsByTestIdService,
  submitStudentAttemptService,
} from "../services/student_attempt.service.ts";

export const deleteStudentAttempt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_ID_REQUIRED);
    }

    const data = await deleteStudentAttemptService(id);
    res.ok(data, SUCCESS_MESSAGES.STUDENT_ATTEMPT_DELETED);
  } catch (err: any) {
    next(err);
  }
};

export const getStudentAttemptsDetailsByTestId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { testId } = req.allParams;
    if (!testId) {
      return res.badRequest(ERROR_MESSAGES.TEST_ID_REQUIRED);
    }

    const data = await getStudentAttemptsDetailsByTestIdService(testId);
    res.ok(data, SUCCESS_MESSAGES.STUDENT_ATTEMPTS_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const submitStudentAttempt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      return res.notFound(ERROR_MESSAGES.STUDENT_ATTEMPT_NOT_FOUND);
    }

    const data = await submitStudentAttemptService(id);
    res.ok(data, SUCCESS_MESSAGES.STUDENT_ATTEMPT_UPDATED);
  } catch (err: any) {
    next(err);
  }
};
