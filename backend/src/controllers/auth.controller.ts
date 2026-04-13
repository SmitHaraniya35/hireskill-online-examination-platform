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
import type { AuthJwtPayload, AuthRequest } from "../types/controller/index.ts";
import type { Admin, LoginRequestData, LoginResponseData, ResetPasswordData, VerifyOtpData } from "../types/controller/authData.types.ts";
import { generateApiKey } from "../utils/helper.utils.ts";
import { verifyRefreshToken } from "../utils/jwt.utils.ts";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.allParams as LoginRequestData;
    if (!email || !password) {
      return res.badRequest(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
    }

    const { user, accessToken, refreshToken } = await loginService(email, password);

    const safeUser: Admin = {
      email: user.email,
      id: user.id
    }

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    const data: LoginResponseData = {
      admin: safeUser,
      accessToken
    }

    res.ok(SUCCESS_MESSAGES.LOGIN_SUCCESS, data);
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
      return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED_ADMIN);
    }

    const { user: admin } = await getMeService(user.userId, user.email);

    const safeUser: Admin = {
      id: admin.id,
      email: admin.email
    }

    const data = {
      user: safeUser
    }
    
    res.ok(SUCCESS_MESSAGES.ADMIN_RETRIEVED, data);
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
    const { email, password } = req.allParams as LoginRequestData;
    if (!email || !password) {
      return res.badRequest(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
    }

    const data = await createAdminService(email, password);
    res.created(SUCCESS_MESSAGES.ADMIN_CREATED, data);
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
    if(!refreshToken) {
      return res.unauthorized(ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    try {
      const { userId, refresh_token_id } = verifyRefreshToken(refreshToken);

      const data = await refreshTokenService(userId, refresh_token_id);

      res.cookie("refreshToken", data.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.ok(SUCCESS_MESSAGES.ACCESS_TOKEN_GENERATED, { accessToken: data.accessToken });
    } catch (err: any) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.unauthorized(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }
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
    const { email } = req.allParams as { email: string };
    if (!email) {
      return res.badRequest(ERROR_MESSAGES.EMAIL_REQUIRED);
    }

    const data = await forgetPasswordService(email);
    res.ok(SUCCESS_MESSAGES.OTP_GENERATED, data);
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
    const { email, otp } = req.allParams as VerifyOtpData;
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
    const { email, newPassword } = req.allParams as ResetPasswordData;
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
    const refreshToken = req.cookies.refreshToken;

    if(refreshToken) {
      try {
        const { userId, refresh_token_id } = verifyRefreshToken(refreshToken);
        await logoutService(userId, refresh_token_id);
      } catch (err: any) {
        res.unauthorized(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
      }
    }

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

export const createClient = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { client_id } = req.body;
    const data = await createClientService(client_id);
    
    res.created(SUCCESS_MESSAGES.CLIENT_CREATED, data);
  } catch (err: any) {
    next(err);  
  }
};
