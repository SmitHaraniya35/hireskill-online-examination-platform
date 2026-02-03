import { model } from "mongoose";
import type { TestLinkDocument, TestLinkModel } from "../types/model/test_link.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const TestLinkSchema = generateSchema<TestLinkDocument>({
    title: { type: String },
    unique_token: { type: String },
    expiration_at: { type: Date },
    duration_minutes: { type: Number },
    is_active: { type: Boolean }
});

export class TestLinkClass extends BaseClass<TestLinkDocument> {}

TestLinkSchema.loadClass(TestLinkClass);

export const TestLink = model<TestLinkDocument, TestLinkModel>('TestLink', TestLinkSchema);