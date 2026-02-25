import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import type {
  CodingProblemData,
  CodingProblemWithTestCasesData,
} from "../types/controller/codingProblemData.types.ts";
import {
  createCodingProblemService,
  createCodingProblemWithTestCasesService,
  getCodingProblemWithTestCasesService,
  updateCodingProblemWithTestCasesService,
  deleteCodingProblemService,
  getAllCodingProblemsService,
  getCodingProblemByIdService,
  updateCodingProblemService,
} from "../services/codingProblem.service.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";

export const createCodingProblem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const input = req.allParams as CodingProblemData;
    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await createCodingProblemService(input, admin.userId);
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const getCodingProblemById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_ID_REQUIRED);
    }

    const data = await getCodingProblemByIdService(id);
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const getAllCodingProblems = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const data = await getAllCodingProblemsService();
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEMS_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const updateCodingProblem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const updatedInput = req.allParams as CodingProblemData;
    const { id } = req.allParams;

    if (!updatedInput) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await updateCodingProblemService(id, updatedInput);
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_UPDATED);
  } catch (err: any) {
    next(err);
  }
};

export const deleteCodingProblem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_ID_REQUIRED);
    }

    const data = await deleteCodingProblemService(id);
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_DELETED);
  } catch (err: any) {
    next(err);
  }
};

export const createCodingProblemWithTestCases = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const input = req.allParams as CodingProblemWithTestCasesData;
    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await createCodingProblemWithTestCasesService(
      input,
      admin.userId,
    );
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const getCodingProblemWithTestCases = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_ID_REQUIRED);
    }

    const data = await getCodingProblemWithTestCasesService(id);
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const updateCodingProblemWithTestCases = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.badRequest(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const input = req.allParams as CodingProblemWithTestCasesData;
    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await updateCodingProblemWithTestCasesService(
      input,
      admin.userId,
    );
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_CREATED);
  } catch (err: any) {
    next(err);
  }
};
