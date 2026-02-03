import type { BaseDocument, BaseModel } from "./index.ts";

export interface CodingProblemDocument extends BaseDocument{
    title: string;
    difficulty: string;
    topic: string;
    problem_description: string;
    problem_description_image: ImageData;
    constraint: string;
    input_format: string;
    output_format: string;
    sample_input: string;
    sample_output: string;
    basic_code_layout: string;
    created_by: string; 
}

export interface CodingProblemModel extends BaseModel<CodingProblemDocument>{}