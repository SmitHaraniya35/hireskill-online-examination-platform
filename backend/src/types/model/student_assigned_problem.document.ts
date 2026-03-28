import type { BaseDocument, BaseModel } from "./index.ts";

export interface StudentAssignedProblemDocument extends BaseDocument {
    student_attempt_id: string;
    problem_id: string;
    is_submitted: boolean;
    status: string;
    last_saved_code: string;
    last_language: string;
    last_saved_at: Date;
}

export interface StudentAssignedProblemModel extends BaseModel<StudentAssignedProblemDocument> {}