import type { BaseDocument, BaseModel } from "./index.ts";

export interface TestDocument extends BaseDocument{
    title: string;
    unique_token: string;
    start_at: Date;
    expiration_at: Date;
    duration_minutes: number;
    is_active: boolean;
    is_public: boolean;
    count_of_total_problem : number;
    count_of_easy_problem : number;
    count_of_medium_problem : number;
    count_of_hard_problem : number;
    created_by: string;
}

export interface TestModel extends BaseModel<TestDocument> {}