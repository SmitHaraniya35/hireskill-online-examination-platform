import type { BaseDocument, BaseModel } from "./index.ts";

export interface UserDocument extends BaseDocument{
    email: string,
    password: string,
    role: string,
    refreshTokenId: string,
    password_reset_otp: number,
    password_reset_otp_expires: Date
}

export interface UserModel extends BaseModel<UserDocument> {}