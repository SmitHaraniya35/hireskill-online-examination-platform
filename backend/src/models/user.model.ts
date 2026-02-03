import { model } from "mongoose";
import type { UserDocument, UserModel } from "../types/model/user.document.ts";
import { generateSchema } from "./baseModel/Index.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";

const UserSchema = generateSchema<UserDocument>({
    email: { type: String },
    password: { type: String },
    role: { type: String },
    refreshTokenId: { type: String, default: null },
    password_reset_otp: { type: Number, default: null },
    password_reset_otp_expires: { type: Date, default: null }
})

export class UserClass extends BaseClass<UserDocument> {}

UserSchema.loadClass(UserClass);

export const User = model<UserDocument, UserModel>('User', UserSchema);