import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import {
  createTestService,
  getAllTestService,
  getTestByIdService,
  deleteTestService,
  updateTestService,
  startTestService,
} from "../services/test.service.ts";
import type { SubmissionData } from "../types/controller/submissionData.types.ts";
import { submitStudentAttemptService } from "../services/student_attempt.service.ts";
import { createSubmissionService } from "../services/submission.service.ts";

export const createTest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, duration_minutes, expiration_at } = req.allParams;

    const adminId = req.user!.userId;
    if (!adminId) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    if (!title || !duration_minutes || !expiration_at) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const expiry = new Date(expiration_at);

    const data = await createTestService(
      title,
      duration_minutes,
      expiry,
      adminId,
    );
    res.ok(data, SUCCESS_MESSAGES.TEST_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const getTestById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.TEST_ID_REQUIRED);
    }

    const data = await getTestByIdService(id);
    res.ok(data, SUCCESS_MESSAGES.TESTS_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const getAllTests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const data = await getAllTestService();
    res.ok(data, SUCCESS_MESSAGES.TESTS_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const updateTest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const { id, title, duration_minutes, expiration_at } = req.allParams;
    if (!id || !title || !duration_minutes || !expiration_at) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const expiry = new Date(expiration_at);
    const data = await updateTestService(id, title, duration_minutes, expiry);
    res.ok(data, SUCCESS_MESSAGES.TEST_UPDATED);
  } catch (err: any) {
    next(err);
  }
};

export const deleteTest = async (
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
      return res.badRequest(ERROR_MESSAGES.TEST_ID_REQUIRED);
    }

    const data = await deleteTestService(id);
    res.ok(data, SUCCESS_MESSAGES.TEST_DELETED);
  } catch (err: any) {
    next(err);
  }
};

export const startTest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { test_id, student_id } = req.allParams;
    if (!test_id || !student_id) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await startTestService(test_id, student_id);
    res.ok(data, SUCCESS_MESSAGES.TEST_STARTED);
  } catch (err: any) {
    next(err);
  }
};

export const finishTest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.allParams as SubmissionData;
    const { student_attempt_id } = req.allParams;

    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const student_attempt =
      await submitStudentAttemptService(student_attempt_id);
    if (!student_attempt) {
      return res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_NOT_FOUND);
    }

    const submission = await createSubmissionService(input);

    res.clearCookie("studentToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.ok({ student_attempt, submission }, SUCCESS_MESSAGES.TEST_COMPLETED);
  } catch (err: any) {
    next(err);
  }
};
