import { model } from "mongoose";
import type { AssignedProblemDocument, AssignedProblemModel } from "../types/model/assigned_problem.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const AssignedProblemSchema = generateSchema<AssignedProblemDocument>({
    user_attempt_id: { type: String },
    problem_id: { type: String }
});

AssignedProblemSchema.virtual('user_attempt', {
    ref: 'UserAttempt',
    localField: 'user_attempt_id',
    foreignField: 'id',
});

AssignedProblemSchema.virtual('problem', {
    ref: 'CodingProblem',
    localField: 'problem_id',
    foreignField: 'id',
});

export class AssignedProblemClass extends BaseClass<AssignedProblemDocument> {}

AssignedProblemSchema.loadClass(AssignedProblemClass);

export const AssignedProblem = model<AssignedProblemDocument, AssignedProblemModel>(
    "AssignedProblem",
    AssignedProblemSchema
);
