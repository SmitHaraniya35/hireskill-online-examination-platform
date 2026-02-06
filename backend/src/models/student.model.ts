import { model } from "mongoose";
import type { StudentDocument, StudentModel } from "../types/model/student.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";

const StudentSchema = generateSchema<StudentDocument>({
    name: { type: String },
    email: { type: String },
    phone: { type: Number },
    college: {type: String, default: null },
    degree: {type: String, default: null},
    branch: {type: String, default: null},
    graduation_year: { type: Number, default: null},
    skills: {type: String, default: null},
    resume_url: {type: String, default: null},
    linkedin_url: {type: String, default: null},
    github_url: {type: String, default: null},
});

export class StudentClass extends BaseClass<StudentDocument> {}

StudentSchema.loadClass(StudentClass);

export const Student = model<StudentDocument, StudentModel>(
    'Student', 
    StudentSchema
);