import { model } from "mongoose";
import type { StudentAssignedProblemDocument, StudentAssignedProblemModel } from "../types/model/student_assigned_problem.document.ts";
import { generateSchema } from "./baseModel/Index.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";

const StudentAssignedProblemSchema = generateSchema<StudentAssignedProblemDocument>({
    student_attempt_id: { type: String },
    problem_id: { type: String },
    is_submitted: { type: Boolean, default: false },
    status: { type: String, enum: ["Not Attempted", "Attempted", "Submitted"], default: "Not Attempted" },
    last_saved_code: { type: String, default: null },
    last_language: { type: String, default: null },
    last_saved_at: { type: Date, default: Date.now }
});

StudentAssignedProblemSchema.virtual("codingProblem", {
  ref: "CodingProblem",
  localField: "problem_id",
  foreignField: "id",
  justOne: true
});

StudentAssignedProblemSchema.virtual("submission", {
    ref: "Submission",
    localField: "id",
    foreignField: "assigned_problem_id",
    justOne: true
})

StudentAssignedProblemSchema.set("toJSON", { virtuals: true });
StudentAssignedProblemSchema.set("toObject", { virtuals: true });

export class StudentAssignedProblemClass extends BaseClass<StudentAssignedProblemDocument> {}

StudentAssignedProblemSchema.loadClass(StudentAssignedProblemClass);

export const StudentAssignedProblem = model<StudentAssignedProblemDocument, StudentAssignedProblemModel>(
    "StudentAssignedProblem", 
    StudentAssignedProblemSchema
);