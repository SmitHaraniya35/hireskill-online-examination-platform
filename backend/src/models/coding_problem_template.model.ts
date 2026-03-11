import { model } from "mongoose";
import type { CodingProblemTemplateDocument, CodingProblemTemplateModel } from "../types/model/coding_problem_template.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const CodingProblemTemplateSchema = generateSchema<CodingProblemTemplateDocument>({
    problem_id: { type: String },
    language: { type: String, enum: ['C++', 'C', 'Python', 'JavaScript'] },
    basic_code_layout: { type: String },
});


CodingProblemTemplateSchema.virtual('problem', {
    ref: 'CodingProblem',
    localField: 'problem_id',
    foreignField: 'id',
});

CodingProblemTemplateSchema.set('toObject', { virtuals: true });
CodingProblemTemplateSchema.set('toJSON', { virtuals: true });

export class CodingProblemTemplateClass extends BaseClass<CodingProblemTemplateDocument> {}

CodingProblemTemplateSchema.loadClass(CodingProblemTemplateClass);

export const CodingProblemTemplate = model<CodingProblemTemplateDocument, CodingProblemTemplateModel>('CodingProblemTemplate', CodingProblemTemplateSchema);