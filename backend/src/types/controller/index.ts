import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface AuthJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthJwtPayload;
  validateData: any;
  allParams: Record<string, any>;
}