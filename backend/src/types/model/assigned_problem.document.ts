import type { BaseDocument, BaseModel } from "./index.ts";

export interface AssignedProblemDocument extends BaseDocument {
    user_attempt_id: string;
    problem_id: string;
    started_at: Date,
    expires_at: Date,
    is_submitted: boolean
}

export interface AssignedProblemModel extends BaseModel<AssignedProblemDocument> {}
