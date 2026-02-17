import type { Request, Response, NextFunction } from "express";
import { Client } from "../models/client.model.ts";
import { ERROR_MESSAGES } from "../constants/index.ts";

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Api key middleware")
    const client_id = req.header("x-client-id");
    const api_key = req.header("x-api-key");

    if (!client_id || !api_key) {
      return res.notFound(ERROR_MESSAGES.CLIENT_ID_AND_CLIENT_API_KEY_REQUIRED);
    }

    const client = await Client.findOne({
      client_id,
      api_key,
      is_active: true
    });

    if (!client) {
      return res.unauthorized(ERROR_MESSAGES.INVALID_API_CREDENTIALS);
    }

    req.client = client;

    next();

  } catch (err: any) {
    next(err);
  }
};
