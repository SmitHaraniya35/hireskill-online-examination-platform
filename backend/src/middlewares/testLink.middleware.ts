import type { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../constants/index.ts";
import { Test } from "../models/test.model.ts";
import type { TestDocument } from "../types/model/test.document.ts";

export const validateTestLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug: string = req.params["slug"] as string;
    if (!slug) {
      return res.notFound(ERROR_MESSAGES.INVALID_TEST_LINK);
    }

    const test: TestDocument | null = await Test.findOneActive({ unique_token: slug });
    if (!test) {
      return res.notFound(ERROR_MESSAGES.INVALID_TEST_LINK);
    }

    const currentDateTime = new Date();
    if (currentDateTime > test.expiration_at || !test.is_active) {
      return res.notFound(ERROR_MESSAGES.TEST_LINK_EXPIRED);
    }

    req.allParams = {
        ...req.allParams,
        id: test.id
    };
    
    next();
  } catch (err: any) {
    next(err);
  }
};
