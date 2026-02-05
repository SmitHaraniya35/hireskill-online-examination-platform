import type { Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import {
  createTestService,
  getAllTestService,
  getTestByIdService,
  deleteTestService,
  updateTestService,
  validateTestLinkService,
} from "../services/test.service.ts";

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

export const validateTestLink = async (req: AuthRequest, res: Response) => {
  try {
    const slug: string = req.params['slug'] as string;
    if(!slug){
      res.badRequest(ERROR_MESSAGES.INVALID_TEST_LINK);
    }
    await validateTestLinkService(slug!);
    res.ok(SUCCESS_MESSAGES.VALID_TEST_LINK);
  } catch (err: any){
    res.badRequest(err.message);
  }
}