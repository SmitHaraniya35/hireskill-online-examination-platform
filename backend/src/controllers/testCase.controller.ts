import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import {
  createTestCaseService,
  getAllTestCasesByProblemIdService,
  updateTestCaseService,
  deleteTestCaseService,
} from "../services/testCase.service.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import type { TestCaseData } from "../types/controller/testCaseData.types.ts";

export const createTestCase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.allParams as TestCaseData;
    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await createTestCaseService(input);
    res.ok(data, SUCCESS_MESSAGES.TEST_CASE_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const getAllTestCasesByProblemId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { problemId } = req.allParams;
    if (!problemId) {
      return res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_ID_REQUIRED);
    }

    const data = await getAllTestCasesByProblemIdService(problemId);
    res.ok(data, SUCCESS_MESSAGES.TEST_CASES_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const updateTestCase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.allParams as TestCaseData;
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await updateTestCaseService(id, input);
    res.ok(data, SUCCESS_MESSAGES.TEST_CASE_UPDATED);
  } catch (err: any) {
    next(err);
  }
};

export const deleteTestCase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.TEST_CASE_ID_REQUIRED);
    }

    const data = await deleteTestCaseService(id);
    res.ok(data, SUCCESS_MESSAGES.TEST_CASE_DELETED);
  } catch (err: any) {
    next(err);
  }
};
