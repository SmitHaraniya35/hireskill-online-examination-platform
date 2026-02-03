import type { BaseDocument, BaseModel } from "./index.ts";

export interface SubmissionDocument extends BaseDocument {
    user_attempt_id: string;
    problem_id: string;
    language: string;
    source_code: string;
    submitted_at: Date;
}

export interface SubmissionModel extends BaseModel<SubmissionDocument> {}
