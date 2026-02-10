import type { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import { Test } from "../models/test.model.ts";

export const validateTestLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug: string = req.params["slug"] as string;
    if (!slug) {
      res.badRequest(ERROR_MESSAGES.INVALID_TEST_LINK);
    }

    const test = await Test.findOneActive({ unique_token: slug });
    if (!test) {
      throw new Error(ERROR_MESSAGES.INVALID_TEST_LINK);
    }

    const currentDateTime = new Date();
    if (currentDateTime > test.expiration_at || !test.is_active) {
      throw new Error(ERROR_MESSAGES.EXPIRED_TEST_LINK);
    }

    req.allParams = {
        ...req.allParams,
        id: test!.id
    };
    
    next();
  } catch (err: any) {
    res.badRequest(err.message);
  }
};
