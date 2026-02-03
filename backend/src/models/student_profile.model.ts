import { model } from "mongoose";
import type { StudentProfileDocument, StudentProfileModel } from "../types/model/student_profile.document.ts";
import { BaseClass } from "./baseModel/BaseClass.ts";
import { generateSchema } from "./baseModel/Index.ts";
import { string } from "joi";

const StudentProfileSchema = generateSchema<StudentProfileDocument>({
    user_id: { type: String },
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

StudentProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: 'id',
  justOne: true
});

export class StudentProfileClass extends BaseClass<StudentProfileDocument> {}

StudentProfileSchema.loadClass(StudentProfileClass);

export const StudentProfile = model<StudentProfileDocument, StudentProfileModel>(
    'StudentProfile', 
    StudentProfileSchema
);