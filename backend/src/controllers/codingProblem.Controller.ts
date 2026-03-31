import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import type {
  CodingProblemData,
  CodingProblemWithTestCasesAndTemplateData,
} from "../types/controller/codingProblemData.types.ts";
import {
  createCodingProblemService,
  createCodingProblemWithTestCasesAndTemplateCodesService,
  getCodingProblemWithTestCasesAndTemplateCodesService,
  updateCodingProblemWithTestCasesAndTemplateCodesService,
  deleteCodingProblemService,
  getAllCodingProblemsService,
  getCodingProblemByIdService,
  updateCodingProblemService,
  getAllSupportedLanguagesService,
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

export const createCodingProblemWithTestCasesAndTemplateCodes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const input = req.allParams as CodingProblemWithTestCasesAndTemplateData;
    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await createCodingProblemWithTestCasesAndTemplateCodesService(
      input,
      admin.userId,
    );
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const getCodingProblemWithTestCasesAndTemplateCodes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, sample_only } = req.allParams;
    if (!id || !sample_only) {
      return res.badRequest(ERROR_MESSAGES.CODING_PROBLEM_ID_REQUIRED);
    }

    const data = await getCodingProblemWithTestCasesAndTemplateCodesService(id, sample_only);
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const updateCodingProblemWithTestCasesAndTemplateCodes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.badRequest(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const input = req.allParams as CodingProblemWithTestCasesAndTemplateData;
    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await updateCodingProblemWithTestCasesAndTemplateCodesService(
      input,
      admin.userId,
    );
    res.ok(data, SUCCESS_MESSAGES.CODING_PROBLEM_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const getAllSupportedLanguages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getAllSupportedLanguagesService();
    res.ok(data, SUCCESS_MESSAGES.LANGUAGES_RETRIEVED);
  }   
  catch (err: any) {
    next(err);
  }
};
