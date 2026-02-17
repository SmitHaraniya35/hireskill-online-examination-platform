import type { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import {
  loginService,
  getMeService,
  createAdminService,
  refreshTokenService,
  forgetPasswordService,
  resetPasswordService,
  logoutService,
  verifyOtpService,
  createClientService,
} from "../services/auth.service.ts";
import { verifyRefreshToken } from "../utils/jwt.utils.ts";
import type { AuthJwtPayload, AuthRequest } from "../types/controller/index.ts";
import { generateApiKey } from "../utils/helper.utils.ts";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.allParams;
    if (!email || !password) {
      return res.badRequest(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
    }

    const data = await loginService(email, password);

    res.cookie("accessToken", data.accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.cookie("refreshToken", data.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.ok(data, SUCCESS_MESSAGES.LOGIN_SUCCESS);
  } catch (err: any) {
    next(err);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user: AuthJwtPayload | undefined = req.user;
    if (!user) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    const data = await getMeService(user.userId, user.email);
    res.ok(data, SUCCESS_MESSAGES.ADMIN_RETRIEVED);
  } catch (err: any) {
    next(err);
  }
};

export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.allParams;
    if (!email || !password) {
      return res.badRequest(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
    }

    const data = await createAdminService(email, password);
    res.created(data, SUCCESS_MESSAGES.ADMIN_CREATED);
  } catch (err: any) {
    next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.unauthorized(ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    const { userId, refreshTokenId } = verifyRefreshToken(refreshToken);
    if (!userId || !refreshTokenId) {
      return res.unauthorized(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const data = await refreshTokenService(userId, refreshTokenId);

    res.cookie("accessToken", data.accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.ok(data, SUCCESS_MESSAGES.ACCESS_TOKEN_GENERATED);
  } catch (err: any) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.allParams;
    if (!email) {
      return res.badRequest(ERROR_MESSAGES.EMAIL_REQUIRED);
    }

    const data = await forgetPasswordService(email);
    res.ok(data, SUCCESS_MESSAGES.OTP_GENERATED);
  } catch (err: any) {
    next(err);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.allParams;
    if (!email) {
      return res.badRequest(ERROR_MESSAGES.EMAIL_REQUIRED);
    }

    if (!otp) {
      return res.badRequest(ERROR_MESSAGES.OTP_REQUIRED);
    }

    await verifyOtpService(email, otp);
    res.ok(SUCCESS_MESSAGES.OTP_VERIFIED);
  } catch (err: any) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword } = req.allParams;
    if (!email || !newPassword) {
      return res.badRequest(ERROR_MESSAGES.EMAIL_AND_NEWPASSWORD_REQUIRED);
    }

    const data = await resetPasswordService(email, newPassword);
    res.ok(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
  } catch (err: any) {
    next(err);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user: AuthJwtPayload | undefined = req.user;
    if (!user) {
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    await logoutService(user.userId);

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.ok(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  } catch (err: any) {
    next(err);
  }
};

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { client_id } = req.body;
    const data = await createClientService(client_id);
    
    res.created(data, SUCCESS_MESSAGES.CLIENT_CREATED);
  } catch (err: any) {
    next(err);  
  }
};
