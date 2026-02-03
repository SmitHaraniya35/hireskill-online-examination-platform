import type { BaseDocument, BaseModel } from "./index.ts";

export interface UserDocument extends BaseDocument{
    email: string,
    password: string,
    role: string,
    refreshTokenId: string,
    resetToken: string,
    resetTokenExpiry: Date
}

export interface UserModel extends BaseModel<UserDocument> {}