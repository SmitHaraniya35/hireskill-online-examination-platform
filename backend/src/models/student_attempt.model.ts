import { model } from "mongoose";
import type { StudentAttemptDocument, StudentAttemptModel } from "../types/model/student_attempt.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const StudentAttemptSchema = generateSchema<StudentAttemptDocument>({
    student_id: { type: String },
    test_id: { type: String },
    started_at: { type: Date },
    expires_at: { type: Date },
    finished_at: { type: Date, default: null },
    status: { type: String },
    is_submitted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
});

StudentAttemptSchema.virtual('student', {
    ref: 'Student',
    localField: 'student_id',
    foreignField: 'id',
    justOne: true
});

StudentAttemptSchema.virtual('test', {
    ref: 'Test',
    localField: 'test_id',
    foreignField: 'id',
    justOne: true
});

StudentAttemptSchema.set('toObject', { virtuals: true });
StudentAttemptSchema.set('toJSON', { virtuals: true });

export class StudentAttemptClass extends BaseClass<StudentAttemptDocument> {}

StudentAttemptSchema.loadClass(StudentAttemptClass);

export const StudentAttempt = model<StudentAttemptDocument, StudentAttemptModel>(
    "StudentAttempt",
    StudentAttemptSchema
);
