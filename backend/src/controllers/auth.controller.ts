import type { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.ts";
import {
  loginService,
  createAdminService,
  refreshTokenService,
  forgetPasswordService,
  resetPasswordService,
  logoutService,
} from "../services/auth.service.ts";
import { verifyRefreshToken } from "../utils/jwt.utils.ts";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.allParams;
    if (!email || !password) {
      res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
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
    res.badRequest(err.message);
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.allParams;
    if (!email || !password) {
      res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
    }

    const data = await createAdminService(email, password);

    res.created(data, SUCCESS_MESSAGES.ADMIN_CREATED);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.unauthorized(ERROR_MESSAGES.REFRESH_TOKEN_MISSING);
    }

    const { userId, refreshTokenId } = verifyRefreshToken(refreshToken);

    if (!userId && !refreshTokenId) {
      return res.unauthorized(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    }

    const { accessToken } = await refreshTokenService(userId, refreshTokenId);

    res.cookie("accessToken", accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.ok({ token: accessToken }, SUCCESS_MESSAGES.ACCESS_TOKEN);
  } catch (error: any) {
    res.badRequest(error.message);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
    }

    const data = await forgetPasswordService(email);

    res.ok(data, SUCCESS_MESSAGES.RESET_PASSWORD_OTP);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!otp || !email) {
      return res.badRequest(ERROR_MESSAGES.INPUT_MISSING);
    }

    const data = await resetPasswordService(email, otp, newPassword);

    res.ok(data, SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
  } catch (err: any) {
    res.badRequest(err.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    // const userId = req.user?.userId;
    // if(!userId){
    // return res.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    // }

    await logoutService(userId);

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
  } catch (error: any) {
    res.badRequest(error.message);
  }
};
