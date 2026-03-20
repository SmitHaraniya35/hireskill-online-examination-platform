import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import {
  deleteStudentAttemptService,
  getStudentAttemptsDetailsByTestIdService,
  getStudentAttemptSubmissionDetailsAndResultByIdService,
  getStudentAttemptByIdService,
  validateStudentAttemptByEmailAndTestIdService,
  createStudentAttemptService,
  validateStudentAttemptByIdService
} from "../services/studentAttempt.service.ts";
import type { StudentAttemptData, ValidateStudentAttemptData } from "../types/controller/studentAttemptData.types.ts";

export const createStudentAttempt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { test_id, student_id } = req.allParams as StudentAttemptData;
    if (!test_id || !student_id) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await createStudentAttemptService(test_id, student_id);
    res.ok(data, SUCCESS_MESSAGES.STUDENT_ATTEMPT_CREATED);
  } catch (err: any) {
    next(err);
  } 
};

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

export const getStudentAttemptSubmissionDetailsAndResultById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.allParams;
    if(!id) {
      return res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_ID_REQUIRED);
    }

    const data = await getStudentAttemptSubmissionDetailsAndResultByIdService(id);
    res.ok(data, SUCCESS_MESSAGES.STUDENT_ATTEMPT_DETAILS_AND_RESULT_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const getStudentAttemptById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_ID_REQUIRED);
    }

    const data = await getStudentAttemptByIdService(id);

    res.ok(data, SUCCESS_MESSAGES.STUDENT_ATTEMPTS_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const validateStudentAttemptByEmailAndTestId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { test_id, email } = req.allParams as ValidateStudentAttemptData;
    
    if(!email || !test_id){
      res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
      return;
    }

    const data = await validateStudentAttemptByEmailAndTestIdService(email, test_id);
    res.ok(data, SUCCESS_MESSAGES.STUDENT_ATTEMPT_VALIDATED);
  } catch(err: any){
    next(err);
  }
};

export const validateStudentAttemptById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.allParams;
    if(!id) {
      return res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_ID_REQUIRED);
    }

    const data = await validateStudentAttemptByIdService(id);
    res.ok({
      id: data.studentAttempt.id,
      is_active: data.studentAttempt.is_active,
      is_submitted: data.studentAttempt.is_submitted
    }, SUCCESS_MESSAGES.STUDENT_ATTEMPT_VALIDATED);
  } catch(err: any){
    next(err);
  }
};