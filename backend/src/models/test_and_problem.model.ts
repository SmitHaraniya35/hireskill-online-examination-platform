import { model } from "mongoose";
import type { TestAndProblemDocument, TestAndProblemModel } from "../types/model/test_and_problem.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const TestAndProblemSchema = generateSchema<TestAndProblemDocument>({
    test_id: { type: String },
    coding_problem_id: { type: String }
});

TestAndProblemSchema.virtual('test', {
    ref: 'Test',
    localField: 'test_id',
    foreignField: 'id',
    justOne: true
});

TestAndProblemSchema.virtual('codingProblem', {
    ref: 'CodingProblem',
    localField: 'coding_problem_id',
    foreignField: 'id',
    justOne: true
});

TestAndProblemSchema.set('toObject', { virtuals: true });
TestAndProblemSchema.set('toJSON', { virtuals: true });

export class TestAndProblemClass extends BaseClass<TestAndProblemDocument> {}

TestAndProblemSchema.loadClass(TestAndProblemClass);

export const TestAndProblem = model<TestAndProblemDocument, TestAndProblemModel>('TestAndProblem', TestAndProblemSchema);