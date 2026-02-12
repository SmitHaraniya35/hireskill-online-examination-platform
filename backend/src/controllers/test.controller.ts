import type { Response } from "express";
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

export const createTest = async (req: AuthRequest, res: Response) => {
  try {
    const { title, duration_minutes, expiration_at } = req.allParams;
    const adminId = req.user!.userId;
    if (!adminId) {
      res.unauthorized(ERROR_MESSAGES.USER_UNAUTHORIZED);
    }

    const expiry = new Date(expiration_at);

    if (!title || !duration_minutes) {
      res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
    }

    const data = await createTestService(title, duration_minutes, expiry, adminId);
    res.ok({ data }, SUCCESS_MESSAGES.TEST_CREATED);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const getTestById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.allParams;

    if (!id) {
      res.badRequest(ERROR_MESSAGES.TEST_ID_MISSING);
    }

    const data = await getTestByIdService(id);

    res.ok(data, SUCCESS_MESSAGES.TEST_FIND);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const getAllTests = async (req: AuthRequest, res: Response) => {
  try {
    const admin = req.user;
    if (!admin) {
      res.unauthorized(ERROR_MESSAGES.USER_UNAUTHORIZED);
    }

    const data = await getAllTestService();
    res.ok(data, SUCCESS_MESSAGES.TEST_LIST_FETCHED);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const updateTest = async (req: AuthRequest, res: Response) => {
  try {
    const admin = req.user;
    if (!admin) {
      res.unauthorized(ERROR_MESSAGES.USER_UNAUTHORIZED);
    }

    const { id, title, duration_minutes, expiration_at } = req.allParams;

    if (!id) {
      res.badRequest(ERROR_MESSAGES.TEST_ID_MISSING);
    }

    if(!title || !duration_minutes || !expiration_at){
        res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
    }

    const expiry = new Date(expiration_at);

    const data = await updateTestService(id, title, duration_minutes, expiry);

    res.ok(data, SUCCESS_MESSAGES.TEST_UPDATED);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const deleteTest = async (req: AuthRequest, res: Response) => {
  try {
    const admin = req.user;
    if (!admin) {
      res.unauthorized(ERROR_MESSAGES.USER_UNAUTHORIZED);
    }

    const { id } = req.allParams;

    if (!id) {
      res.badRequest(ERROR_MESSAGES.TEST_ID_MISSING);
    }

    const data = await deleteTestService(id);

    res.ok(data, SUCCESS_MESSAGES.TEST_DELETED);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const startTest = async (req: AuthRequest, res: Response) => {
  try {
    const { test_id, student_id } = req.allParams;

    const data = await startTestService(test_id, student_id);
    
    res.ok(data, SUCCESS_MESSAGES.TEST_STARTED);
  } catch(err: any) {
    res.badRequest(err.message);
  }
};

export const finishTest = async (req: AuthRequest, res: Response) => {
  try {
    const input = req.allParams as SubmissionData;
    
    const { student_attempt_id } = req.allParams;
    const student_attempt = await submitStudentAttemptService(student_attempt_id);
    if(!student_attempt){
      res.badRequest(ERROR_MESSAGES.STUDENT_ATTEMPT_NOT_FOUND);
    }

    const submission = await createSubmissionService(input);
    if(!submission){
      res.badRequest(ERROR_MESSAGES.SUBMISSION_CREATE_FAILED)
    }

    res.ok({ student_attempt, submission }, SUCCESS_MESSAGES.TEST_FINISHED);

  } catch(err: any){
    res.badRequest(err.message);
  }
}
