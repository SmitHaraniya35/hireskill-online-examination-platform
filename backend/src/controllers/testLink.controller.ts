import type { Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import {
  createTestLinkService,
  getAllTestLinkService,
  getTestLinkByIdService,
  deleteTestLinkService,
  updateTestLinkService,
} from "../services/testLink.service.ts";

export const createTestLink = async (req: AuthRequest, res: Response) => {
  try {
    const { title, duration_minutes, expiration_at } = req.allParams;
    const adminId = req.user!.userId;
    if (!adminId) {
      res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const expiry = new Date(expiration_at);

    if (!title || !duration_minutes) {
      res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
    }

    const data = await createTestLinkService(title, duration_minutes, expiry, adminId);
    res.ok({ data }, SUCCESS_MESSAGES.TEST_CREATED);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const getTestLinkById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.allParams;

    if (!id) {
      res.badRequest(ERROR_MESSAGES.TEST_LINK_ID_MISSING);
    }

    const data = await getTestLinkByIdService(id);

    res.ok(data, SUCCESS_MESSAGES.TEST_FIND);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const getAllTestLink = async (req: AuthRequest, res: Response) => {
  try {
    const admin = req.user;
    if (!admin) {
      res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const data = await getAllTestLinkService();
    res.ok(data, SUCCESS_MESSAGES.TESTLIST_FETCHED);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const updateTestLink = async (req: AuthRequest, res: Response) => {
  try {
    const admin = req.user;
    if (!admin) {
      res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { id, title, duration_minutes, expiration_at } = req.allParams;

    if (!id) {
      res.badRequest(ERROR_MESSAGES.TEST_LINK_ID_MISSING);
    }

    if(!title || !duration_minutes || !expiration_at){
        res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
    }

    const expiry = new Date(expiration_at);

    const data = await updateTestLinkService(id, title, duration_minutes, expiry);

    res.ok(data, SUCCESS_MESSAGES.TEST_UPDATED);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const deleteTestLink = async (req: AuthRequest, res: Response) => {
  try {
    const admin = req.user;
    if (!admin) {
      res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { id } = req.allParams;

    if (!id) {
      res.badRequest(ERROR_MESSAGES.TEST_LINK_ID_MISSING);
    }

    const data = await deleteTestLinkService(id);

    res.ok(data, SUCCESS_MESSAGES.TEST_DELETED);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};
