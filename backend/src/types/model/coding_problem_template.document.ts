import type { BaseDocument, BaseModel } from "./index.ts";

export interface CodingProblemTemplateDocument extends BaseDocument{
    problem_id: string;
    language: string;
    basic_code_layout: string;
}

export interface CodingProblemTemplateModel extends BaseModel<CodingProblemTemplateDocument>{}