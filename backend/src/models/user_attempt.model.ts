import { model } from "mongoose";
import type { UserAttemptDocument, UserAttemptModel } from "../types/model/user_attempt.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const UserAttemptSchema = generateSchema<UserAttemptDocument>({
    user_id: { type: String },
    test_link_id: { type: String },
    started_at: { type: Date },
    expires_at: { type: Date },
    is_submitted: { type: Boolean },
});

UserAttemptSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: 'id',
    justOne: true
});

UserAttemptSchema.virtual('test_link', {
    ref: 'TestLink',
    localField: 'test_link_id',
    foreignField: 'id',
    justOne: true
});

export class UserAttemptClass extends BaseClass<UserAttemptDocument> {}

UserAttemptSchema.loadClass(UserAttemptClass);

export const UserAttempt = model<UserAttemptDocument, UserAttemptModel>(
    "UserAttempt",
    UserAttemptSchema
);
