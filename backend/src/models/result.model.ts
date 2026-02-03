import { model } from "mongoose";
import type { ResultDocument, ResultModel } from "../types/model/result.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const ResultSchema = generateSchema<ResultDocument>({
    submission_id: { type: String },
    total_test_cases: { type: Number },
    passed_test_cases: { type: Number },
    score: { type: Number },
    status: { type: String },
    execution_time: { type: Number },
    memory_used: { type: Number },
});

ResultSchema.virtual('submission', {
    ref: 'Submission',
    localField: 'submission_id',
    foreignField: 'id',
    justOne: true
});

export class ResultClass extends BaseClass<ResultDocument> {}

ResultSchema.loadClass(ResultClass);

export const Result = model<ResultDocument, ResultModel>("Result", ResultSchema);
