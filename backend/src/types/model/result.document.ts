import type { BaseDocument, BaseModel } from "./index.ts";

export interface ResultDocument extends BaseDocument {
    student_attempt_id: string;
    total_score: number;
    achieved_score: number;
    total_problems: number;
    solved_problems: number;
}

export interface ResultModel extends BaseModel<ResultDocument> {}