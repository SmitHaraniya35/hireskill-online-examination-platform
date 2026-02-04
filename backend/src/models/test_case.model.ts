import { model } from "mongoose";
import type { TestCaseDocument, TestCaseModel } from "../types/model/test_case.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const TestCaseSchema = generateSchema<TestCaseDocument>({
    problem_id: { type: String },
    input: { type: String },
    expected_output: { type: String },
    is_hidden: { type: Boolean },
});

TestCaseSchema.virtual('coding_problem', {
    ref: 'User',
    localField: 'problemId',
    foreignField: 'id',
    justOne: true
});

export class TestCaseClass extends BaseClass<TestCaseDocument> {}

TestCaseSchema.loadClass(TestCaseClass);

export const TestCase = model<TestCaseDocument, TestCaseModel>('TestCase', TestCaseSchema);