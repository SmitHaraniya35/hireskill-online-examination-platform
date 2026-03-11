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
} from "../services/test.service.ts";
import type { SubmissionData } from "../types/controller/submissionData.types.ts";
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
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    input.start_at = new Date(input.start_at);
    input.expiration_at = new Date(input.expiration_at);

    const data = await createTestService(input, adminId);
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

    const input = req.allParams as TestData;
    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    input.expiration_at = new Date(input.expiration_at);
    input.start_at = new Date(input.start_at);

    const data = await updateTestService(input);
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

    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await finishTestService(input);

    res.clearCookie("studentToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.ok(data, SUCCESS_MESSAGES.TEST_COMPLETED);
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
    res.ok(data, SUCCESS_MESSAGES.TEST_ACTIVATION_TOGGLED);
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
    res.ok(data, SUCCESS_MESSAGES.TEST_PUBLIC_STATUS_TOGGLED);
  } catch (err: any) {
    next(err);
  } 
};
