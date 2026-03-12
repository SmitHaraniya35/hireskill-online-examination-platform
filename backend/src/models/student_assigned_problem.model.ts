import { model } from "mongoose";
import type { StudentAssignedProblemDocument } from "../types/model/student_assigned_problem.document.ts";
import { generateSchema } from "./baseModel/Index.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";

const StudentAssignedProblemSchema = generateSchema<StudentAssignedProblemDocument>({
    student_attempt_id: { type: String },
    problem_id: { type: String },
    is_submitted: { type: Boolean, default: false },
    last_saved_code: { type: String, default: null },
    last_language: { type: String, default: null },
    last_saved_at: { type: Date, default: Date.now }
});

export class StudentAssignedProblemClass extends BaseClass<StudentAssignedProblemDocument> {}

StudentAssignedProblemSchema.loadClass(StudentAssignedProblemClass);

export const StudentAssignedProblem = model<StudentAssignedProblemDocument>(
    "StudentAssignedProblem", 
    StudentAssignedProblemSchema
);