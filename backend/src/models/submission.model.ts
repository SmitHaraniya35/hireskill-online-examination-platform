import { model } from "mongoose";
import type { SubmissionDocument, SubmissionModel } from "../types/model/submission.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const SubmissionSchema = generateSchema<SubmissionDocument>({
    student_attempt_id: { type: String },
    problem_id: { type: String },
    language: { type: String },
    source_code: { type: String },
    submitted_at: { type: Date, default: Date.now },
    total_test_cases: { type: Number },
    passed_test_cases: { type: Number },
    status: { type: String },
    execution_time: { type: String },
    memory_used: { type: String },
});

SubmissionSchema.virtual('problem', {
    ref: 'CodingProblem',
    localField: 'problem_id',
    foreignField: 'id',
    justOne: true
});

SubmissionSchema.virtual('student_attempt', {
    ref: 'StudentAttempt',
    localField: 'student_attempt_id',
    foreignField: 'id'
});

export class SubmissionClass extends BaseClass<SubmissionDocument> {}

SubmissionSchema.loadClass(SubmissionClass);

export const Submission = model<SubmissionDocument, SubmissionModel>(
    "Submission",
    SubmissionSchema
);
