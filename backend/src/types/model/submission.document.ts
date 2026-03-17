import type { BaseDocument, BaseModel } from "./index.ts";

export interface SubmissionDocument extends BaseDocument {
    assigned_problem_id: string;
    language: string;
    source_code: string;
    submitted_at: Date;
    total_test_cases: number;
    passed_test_cases: number;
    status: string;
    execution_time: string;
    memory_used: string;
}

export interface SubmissionModel extends BaseModel<SubmissionDocument> {}
