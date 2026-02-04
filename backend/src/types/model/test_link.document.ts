import type { BaseDocument, BaseModel } from "./index.ts";
import type { TestCaseDocument } from "./test_case.document.ts";

export interface TestLinkDocument extends BaseDocument{
    title: string;
    unique_token: string;
    expiration_at: Date;
    duration_minutes: number;
    is_active: boolean;
}

export interface TestLinkModel extends BaseModel<TestCaseDocument> {}