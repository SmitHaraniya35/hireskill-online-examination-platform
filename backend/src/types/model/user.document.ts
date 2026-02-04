import type { BaseDocument, BaseModel } from "./index.ts";

export interface UserDocument extends BaseDocument{
    email: string,
    password: string,
    role: string,
    refreshTokenId: string | null,
    password_reset_otp: string | null,
    password_reset_otp_expires: number | null,
    is_otp_verified: boolean
}

export interface UserModel extends BaseModel<UserDocument> {}