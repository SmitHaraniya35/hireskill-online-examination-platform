import type { BaseDocument, BaseModel } from "./index.ts";

export interface StudentAttemptDocument extends BaseDocument {
    student_id: string;
    test_id: string;
    problem_id: string;
    started_at: Date;
    expires_at: Date;
    is_submitted: boolean;
    is_active: boolean;
}

export interface StudentAttemptModel extends BaseModel<StudentAttemptDocument> {}
