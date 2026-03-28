import { model } from "mongoose";
import type { ResultDocument, ResultModel } from "../types/model/result.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const ResultSchema = generateSchema<ResultDocument>({
    student_attempt_id: { type: String },
    total_score: { type: Number, default: 0 },
    achieved_score: { type: Number, default: 0 },
    total_problems: { type: Number, default: 0 },
    solved_problems: { type: Number, default: 0 }
});

export class ResultClass extends BaseClass<ResultDocument> {}

ResultSchema.virtual('studentAttempt', {
    ref: 'StudentAttempt',
    localField: 'student_attempt_id',
    foreignField: 'id',
    justOne: true
});

ResultSchema.set('toObject', { virtuals: true });
ResultSchema.set('toJSON', { virtuals: true });

ResultSchema.loadClass(ResultClass);

export const Result = model<ResultDocument, ResultModel>(
    "Result", 
    ResultSchema
);