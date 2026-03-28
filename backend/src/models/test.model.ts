import { model } from "mongoose";
import type { TestDocument, TestModel } from "../types/model/test.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const TestSchema = generateSchema<TestDocument>({
    title: { type: String },
    created_by: { type: String },
    unique_token: { type: String },
    start_at: { type: Date },
    expiration_at: { type: Date },
    duration_minutes: { type: Number },
    is_active: { type: Boolean, default: true },
    is_public: { type: Boolean, default: true },
    count_of_total_problem : { type: Number },
    count_of_easy_problem : { type: Number },
    count_of_medium_problem : { type: Number },
    count_of_hard_problem : { type: Number },
});

TestSchema.virtual('testAndProblems', {
    ref: 'TestAndProblem',
    localField: 'id',
    foreignField: 'test_id',
    justOne: false,
});

TestSchema.set('toObject', { virtuals: true });
TestSchema.set('toJSON', { virtuals: true });

export class TestClass extends BaseClass<TestDocument> {}

TestSchema.loadClass(TestClass);

export const Test = model<TestDocument, TestModel>('Test', TestSchema);