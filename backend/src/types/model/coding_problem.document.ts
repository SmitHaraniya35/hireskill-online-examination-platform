import type { BaseDocument, BaseModel } from "./index.ts";

export interface CodingProblemDocument extends BaseDocument{
    title: string;
    difficulty: string;
    topic: string[];
    problem_description: string;
    constraint: string;
    input_format: string;
    output_format: string;
    created_by: string; 
}

export interface CodingProblemModel extends BaseModel<CodingProblemDocument>{}