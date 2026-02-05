import type { BaseDocument, BaseModel } from "./index.ts";

export interface UserAttemptDocument extends BaseDocument {
    user_id: string;
    test_id: string;
    started_at: Date;
    expires_at: Date;
    is_submitted: boolean;
}

export interface UserAttemptModel extends BaseModel<UserAttemptDocument> {}
