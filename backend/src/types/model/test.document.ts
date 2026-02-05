import type { BaseDocument, BaseModel } from "./index.ts";

export interface TestDocument extends BaseDocument{
    title: string;
    unique_token: string;
    expiration_at: Date;
    duration_minutes: number;
    is_active: boolean;
    created_by: string;
}

export interface TestModel extends BaseModel<TestDocument> {}