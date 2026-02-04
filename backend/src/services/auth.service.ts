import bcrypt from "bcryptjs";
import { User } from "../models/user.model.ts";
import { ERROR_MESSAGES } from "../constants/index.ts";
import { generateAccessToken, generateRefreshToken, generateRefreshTokenId } from "../utils/jwt.utils.ts";
import { generateResetPasswordOTP } from "../utils/helper.utils.ts";
import type { UserDocument } from "../types/model/user.document.ts";

export const loginService = async (email: string, password: string) => {
    const user = await User.findOneActive({ email });
    if (!user) throw new Error(ERROR_MESSAGES.INVALID_CREDENTIAL);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error(ERROR_MESSAGES.INVALID_CREDENTIAL);

    const accessToken = generateAccessToken(user.id, user.email);

    user.refreshTokenId = (await generateRefreshTokenId()).toString();
    await user.save();

    const refreshToken = generateRefreshToken(user.id, user.refreshTokenId);

    return { user, accessToken, refreshToken };
};

export const createAdminService = async (email: string, password: string) => {
    const adminExists: UserDocument | null = await User.findOneActive({ email });
    if (adminExists){
        throw new Error(ERROR_MESSAGES.ADMIN_EXISTS);
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const admin: UserDocument = await User.create({
        email,
        password: hashedPassword,
    });

    admin.save();

    return { admin };
};

export const refreshTokenService = async (userId: string, refreshTokenId: string) => {
    const user = await User.findOneActive({id: userId});

    if(!user){
      throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);
    }

    if(user.refreshTokenId !== refreshTokenId){
        throw new Error(ERROR_MESSAGES.REFRESH_TOKEN_INVALID); 
    }

    const accessToken: string = generateAccessToken(user.id, user.email);

    return { accessToken };
};

export const forgetPasswordService = async (email: string) => {
  const admin = await User.findOne({ email });
  if (!admin) throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);

  const otp = generateResetPasswordOTP();

  admin.password_reset_otp = otp;
  admin.password_reset_otp_expires = Date.now() + 2 * 60 * 1000; // 2 min
  await admin.save();

  // Logic: Send otp to admin's email...

  return { otp };
};

export const verifyOtpService = async (email: string, otp: string) => {
    const admin: UserDocument | null = await User.findOneActive({ email });

    if (!admin) throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);

    if (admin.password_reset_otp !== otp || admin.password_reset_otp_expires! < Date.now()) {
        throw new Error(ERROR_MESSAGES.OTP_EXPIRED);
    }

    return;
}

export const resetPasswordService = async (email: string, newPassword: string) => {

    const admin: UserDocument | null = await User.findOneActive({ email });

    if (!admin) throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);

    const oldPassword = admin.password;
    
    const hashed: string = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;

    admin.password_reset_otp = null;
    admin.password_reset_otp_expires = null;

    await admin.save();

    return { oldPassword, newPassword: hashed };
};

export const logoutService = async (userId: string) => {
    const admin = await User.findOneActive({id: userId});

    if(!admin){
      throw new Error(ERROR_MESSAGES.ADMIN_NOT_EXIST);
    }

    admin.refreshTokenId = "";
    await admin.save();
    return;
}