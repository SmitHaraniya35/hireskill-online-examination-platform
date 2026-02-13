import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import {
  createStudentService,
  deleteStudentService,
  getAllStudentService,
  getStudentByIdService,
  updateStudentService,
} from "../services/student.service.ts";
import type { AuthRequest } from "../types/controller/index.ts";
import type { NextFunction, Response } from "express";
import type { StudentData } from "../types/controller/studentData.types.ts";

export const createStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.allParams as StudentData;
    if (!input) {
      return res.badRequest(ERROR_MESSAGES.REQUIRED_FIELDS_MISSING);
    }

    const data = await createStudentService(input);

    res.cookie("studentToken", data.studentToken, {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.created(data, SUCCESS_MESSAGES.STUDENT_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const getStudentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      return res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_ID_REQUIRED);
    }

    const data = await getStudentByIdService(id);
    res.ok(data, SUCCESS_MESSAGES.STUDENT_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const getAllStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const data = await getAllStudentService();
    res.ok(data, SUCCESS_MESSAGES.STUDENTS_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const updateStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.allParams as StudentData;
    if (input && !input.id) {
      return res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_ID_REQUIRED);
    }

    const data = await updateStudentService(input!.id!, input);
    res.ok(data, SUCCESS_MESSAGES.STUDENT_UPDATED);
  } catch (err: any) {
    next(err);
  }
};

export const deleteStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.allParams;
    if (!id) {
      res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_ID_REQUIRED);
    }

    const data = await deleteStudentService(id);
    res.ok(data, SUCCESS_MESSAGES.STUDENT_DELETED);
  } catch (err: any) {
    next(err);
  }
};
