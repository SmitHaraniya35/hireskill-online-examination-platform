import { model } from "mongoose";
import type { StudentDocument, StudentModel } from "../types/model/student_profile.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const StudentSchema = generateSchema<StudentDocument>({
    name: { type: String },
    phone: { type: Number },
    college: {type: String },
    degree: {type: String },
    branch: {type: String },
    graduation_year: { type: Number },
    skills: {type: String },
    resume_url: {type: String },
    linkedin_url: {type: String },
    github_url: {type: String },
});

export class StudentClass extends BaseClass<StudentDocument> {}

StudentSchema.loadClass(StudentClass);

export const StudentProfile = model<StudentDocument, StudentModel>(
    'Student', 
    StudentSchema
);