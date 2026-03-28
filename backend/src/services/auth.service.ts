import bcrypt from "bcryptjs";
import { User } from "../models/user.model.ts";
import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  generateRefreshTokenId,
  verifyRefreshToken,
} from "../utils/jwt.utils.ts";
import { generateApiKey, generateResetPasswordOTP } from "../utils/helper.utils.ts";
import type { UserDocument } from "../types/model/user.document.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import { Client } from "../models/client.model.ts";
import { sendEmail } from "./email.service.ts";

export const loginService = async (email: string, password: string) => {
  const user: UserDocument | null = await User.findOneActive({ email });
  if (!user) {
    throw new HttpError(
      ERROR_MESSAGES.INVALID_CREDENTIALS,
      HttpStatusCode.UNAUTHORIZED,
    );
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new HttpError(
      ERROR_MESSAGES.INVALID_CREDENTIALS,
      HttpStatusCode.UNAUTHORIZED,
    );
  }

  const accessToken = generateAccessToken(user.id, user.email);

  user.refresh_token_id = (await generateRefreshTokenId()).toString();
  await user.save();

  const refreshToken = generateRefreshToken(user.id, user.refresh_token_id);

  return { user, accessToken, refreshToken };
};

export const getMeService = async (id: string, email: string) => {
  const user: UserDocument | null = await User.findOneActive(
    { id, email },
    { id: 1, email: 1, role: 1, _id: 0 },
  );

  if (!user) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  return { user };
};

export const createAdminService = async (email: string, password: string) => {
  const userExists: UserDocument | null = await User.findOneActive({ email });
  if (userExists) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_ALREADY_EXISTS,
      HttpStatusCode.CONFLICT,
    );
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);

  const user: UserDocument = await User.create({
    email,
    password: hashedPassword,
  });
  user.save();

  return { user };
};

export const refreshTokenService = async (refreshToken: string) => {
  const { userId, refresh_token_id } = verifyRefreshToken(refreshToken);
  if (!userId || !refresh_token_id) {
    throw new HttpError(
      ERROR_MESSAGES.INVALID_REFRESH_TOKEN, 
      HttpStatusCode.UNAUTHORIZED
    );
  }

  const user: UserDocument | null = await User.findOneActive({ id: userId });
  if (!user) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  if (user.refresh_token_id !== refresh_token_id) {
    throw new HttpError(
      ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
      HttpStatusCode.UNAUTHORIZED,
    );
  }

  const accessToken: string = generateAccessToken(user.id, user.email);
  const newRefreshTokenId: string = (await generateRefreshTokenId()).toString();
  user.refresh_token_id = newRefreshTokenId;
  const newRefreshToken: string = generateRefreshToken(user.id, newRefreshTokenId);
  await user.save();
  
  return { accessToken, refreshToken: newRefreshToken };
};

export const forgetPasswordService = async (email: string) => {
  const user: UserDocument | null = await User.findOne({ email });
  if (!user) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  const otp = generateResetPasswordOTP();

  user.password_reset_otp = otp;
  user.password_reset_otp_expires = Date.now() + 2 * 60 * 1000; // 2 min
  await user.save();

  // Logic: Send otp to admin's email...
  // await sendEmail({
  //   to: user.email,
  //   subject: "Password Reset OTP",
  //   text: `Your OTP for password reset is: ${otp}. It will expire in 2 minutes.`,
  // });

  return { otp };
};

export const verifyOtpService = async (email: string, otp: string) => {
  const user: UserDocument | null = await User.findOneActive({ email });
  if (!user) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  if (
    user.password_reset_otp !== otp ||
    user.password_reset_otp_expires! < Date.now()
  ) {
    throw new HttpError(
      ERROR_MESSAGES.OTP_EXPIRED_OR_INVALID,
      HttpStatusCode.UNAUTHORIZED,
    );
  }

  user.is_otp_verified = true;
  await user.save();
};

export const resetPasswordService = async (
  email: string,
  newPassword: string,
) => {
  const user: UserDocument | null = await User.findOneActive({ email });
  if (!user) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  if (user.password_reset_otp_expires! < Date.now()) {
    throw new HttpError(
      ERROR_MESSAGES.OTP_EXPIRED_OR_INVALID,
      HttpStatusCode.UNAUTHORIZED,
    );
  }

  if (!user.is_otp_verified) {
    throw new HttpError(
      ERROR_MESSAGES.OTP_NOT_VERIFIED,
      HttpStatusCode.UNAUTHORIZED,
    );
  }

  const oldPassword = user.password;

  const hashed: string = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  user.password_reset_otp = null;
  user.password_reset_otp_expires = null;
  user.is_otp_verified = false;

  await user.save();

  return { oldPassword, newPassword: hashed };
};

export const logoutService = async (userId: string) => {
  const user = await User.findOneActive({ id: userId });
  if (!user) {
    throw new HttpError(
      ERROR_MESSAGES.ADMIN_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
    );
  }

  user.refresh_token_id = null;
  await user.save();
  return;
};

export const createClientService = async (client_id: string) => {
  const api_key = generateApiKey();

  const newClient = await Client.create({
    client_id,
    api_key,
    is_active: true,
  });

  return { newClient };
};
