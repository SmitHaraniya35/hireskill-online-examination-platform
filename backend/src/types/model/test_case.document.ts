import type { BaseDocument, BaseModel } from "./index.ts";

export interface TestCaseDocument extends BaseDocument{
    problem_id: string,
    input: string,
    expected_output: string,
    is_hidden: boolean 
}

export interface TestCaseModel extends BaseModel<TestCaseDocument> {}