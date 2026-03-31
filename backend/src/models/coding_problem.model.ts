import { model } from "mongoose";
import type { CodingProblemDocument, CodingProblemModel } from "../types/model/coding_problem.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const CodingProblemSchema = generateSchema<CodingProblemDocument>({
    title: { type: String },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    topic: { type: [String] },
    problem_description: { type: String },
    constraint: { type: String },
    input_format: { type: String },
    output_format: { type: String },
    created_by: { type: String },
});

CodingProblemSchema.virtual('testCases', {
    ref: 'TestCase',
    localField: 'id',
    foreignField: 'problem_id',
});

CodingProblemSchema.virtual('templateCodes', {
    ref: 'CodingProblemTemplate',
    localField: 'id',
    foreignField: 'problem_id',
});

CodingProblemSchema.set('toObject', { virtuals: true });
CodingProblemSchema.set('toJSON', { virtuals: true });

export class CodingProblemClass extends BaseClass<CodingProblemDocument> {}

CodingProblemSchema.loadClass(CodingProblemClass);

export const CodingProblem = model<CodingProblemDocument, CodingProblemModel>('CodingProblem', CodingProblemSchema);