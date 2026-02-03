import type { BaseDocument, BaseModel } from "./index.ts";

export interface UserDocument extends BaseDocument{
    name: string,
    email: string,
    password: string,
    role: string
}

export interface UserModel extends BaseModel<UserDocument> {}