import { model } from "mongoose";
import type { SubmissionDocument, SubmissionModel } from "../types/model/submission.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const SubmissionSchema = generateSchema<SubmissionDocument>({
    user_attempt_id: { type: String, required: true },
    problem_id: { type: String, required: true },
    language: { type: String, required: true },
    source_code: { type: String, required: true },
    submitted_at: { type: Date, default: Date.now },
});

SubmissionSchema.virtual('problem', {
    ref: 'CodingProblem',
    localField: 'problem_id',
    foreignField: 'id',
    justOne: true
});

SubmissionSchema.virtual('user_attempt', {
    ref: 'UserAttempt',
    localField: 'user_attempt_id',
    foreignField: 'id'
});

export class SubmissionClass extends BaseClass<SubmissionDocument> {}

SubmissionSchema.loadClass(SubmissionClass);

export const Submission = model<SubmissionDocument, SubmissionModel>(
    "Submission",
    SubmissionSchema
);
