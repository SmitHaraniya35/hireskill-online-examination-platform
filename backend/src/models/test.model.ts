import { model } from "mongoose";
import type { TestDocument, TestModel } from "../types/model/test.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const TestSchema = generateSchema<TestDocument>({
    title: { type: String },
    unique_token: { type: String },
    expiration_at: { type: Date },
    duration_minutes: { type: Number },
    is_active: { type: Boolean },
    created_by: { type: String }
});

TestSchema.virtual('user', {
    ref: 'User',
    localField: 'created_by',
    foreignField: 'id'
});

export class TestClass extends BaseClass<TestDocument> {}

TestSchema.loadClass(TestClass);

export const Test = model<TestDocument, TestModel>('Test', TestSchema);