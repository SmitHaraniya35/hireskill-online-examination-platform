import type { BaseDocument, BaseModel } from "./index.ts";

export interface TestAndProblemDocument extends BaseDocument {
    test_id: string;
    coding_problem_id: string;
};

export interface TestAndProblemModel extends BaseModel<TestAndProblemDocument> {}

