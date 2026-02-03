import type { BaseDocument, BaseModel } from "./index.ts";

export interface ResultDocument extends BaseDocument {
    submission_id: string;
    total_test_cases: number;
    passed_test_cases: number;
    score: number;
    status: string;
    execution_time?: number;
    memory_used?: number;
}

export interface ResultModel extends BaseModel<ResultDocument> {}
