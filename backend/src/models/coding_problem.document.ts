import { model } from "mongoose";
import type { CodingProblemDocument, CodingProblemModel } from "../types/model/coding_problem.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const CodingProblemSchema = generateSchema<CodingProblemDocument>({
    title: { type: String },
    difficulty: { type: String },
    topic: { type: String },
    problem_description: { type: String },
    problem_description_image: { type: String },
    constraint: { type: String },
    input_format: { type: String },
    output_format: { type: String },
    sample_input: { type: String },
    sample_output: { type: String },
    basic_code_layout: { type: String },
    created_by: { type: String },
});

export class CodingProblemClass extends BaseClass<CodingProblemDocument> {}

CodingProblemSchema.loadClass(CodingProblemClass);

export const CodingProblem = model<CodingProblemDocument, CodingProblemModel>('CodingProblem', CodingProblemSchema);