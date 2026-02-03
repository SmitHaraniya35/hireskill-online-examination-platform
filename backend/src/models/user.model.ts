import { model } from "mongoose";
import type { UserDocument, UserModel } from "../types/model/user.document.ts";
import { generateSchema } from "./baseModel/Index.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";

const UserSchema = generateSchema<UserDocument>({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String }
})

export class UserClass extends BaseClass<UserDocument> {}

UserSchema.loadClass(UserClass);

export const User = model<UserDocument, UserModel>('User', UserSchema);