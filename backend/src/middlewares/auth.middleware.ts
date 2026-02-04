import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils.ts";
import { ERROR_MESSAGES } from "../constants/index.ts";
import type { AuthJwtPayload } from "../types/controller/index.ts";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.unauthorized(ERROR_MESSAGES.ACCESS_TOKEN_MISSING);
  }
  
  try {
    const data = verifyAccessToken(accessToken) as AuthJwtPayload;
    console.log("Protect middleware - verified token data:", data);
    req.user = data;
    next();
  } catch {
    return res.unauthorized(ERROR_MESSAGES.ACCESS_TOKEN_INVALID);
  }
};
