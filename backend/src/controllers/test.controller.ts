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
  finishTestService,
  toggleTestActivationService,
  toggleTestPublicStatusService,
  getTestDataByStudentAttemptIdService,
} from "../services/test.service.ts";
import type { FinishTestData } from "../types/controller/submissionData.types.ts";
import type { TestData } from "../types/controller/testData.types.ts";

export const createTest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.allParams as TestData;

    const adminId = req.user!.userId;
    if (!adminId) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_ADMIN);
    }

    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    input.start_at = new Date(input.start_at);
    input.expiration_at = new Date(input.expiration_at);

    const data = await createTestService(input, adminId);
    res.ok(SUCCESS_MESSAGES.TEST_CREATED, data);
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
    res.ok(SUCCESS_MESSAGES.TEST_RETRIEVED, data);
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
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_ADMIN);
    }

    const data = await getAllTestService();
    res.ok(SUCCESS_MESSAGES.TESTS_RETRIEVED, data);
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
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_ADMIN);
    }

    const input = req.allParams as TestData;
    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    input.expiration_at = new Date(input.expiration_at);
    input.start_at = new Date(input.start_at);

    const data = await updateTestService(input);
    res.ok(SUCCESS_MESSAGES.TEST_UPDATED, data);
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
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_ADMIN);
    }

    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.TEST_ID_REQUIRED);
    }

    const data = await deleteTestService(id);
    res.ok(SUCCESS_MESSAGES.TEST_DELETED, data);
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
    res.ok(SUCCESS_MESSAGES.TEST_STARTED, data);
  } catch (err: any) {
    next(err);
  }
};

export const getTestDataByStudentAttemptId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentAttemptId } = req.allParams;
    if (!studentAttemptId) {
      return res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_ID_REQUIRED);
    }

    const data = await getTestDataByStudentAttemptIdService(studentAttemptId);
    res.ok(SUCCESS_MESSAGES.TEST_DATA_RETRIEVED, data);
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
    const input = req.allParams as FinishTestData;

    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    await finishTestService(input);

    res.ok(SUCCESS_MESSAGES.TEST_COMPLETED);
  } catch (err: any) {
    next(err);
  }
};

export const toggleTestActivation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.TEST_ID_REQUIRED);
    }

    const data = await toggleTestActivationService(id);
    res.ok(SUCCESS_MESSAGES.TEST_ACTIVATION_TOGGLED, data);
  } catch (err: any) {
    next(err);
  }
};

export const toggleTestPublicStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {    
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.TEST_ID_REQUIRED);
    }

    const data = await toggleTestPublicStatusService(id);
    res.ok(SUCCESS_MESSAGES.TEST_PUBLIC_STATUS_TOGGLED, data);
  } catch (err: any) {
    next(err);
  } 
};
