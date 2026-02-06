import type { Document } from "mongoose";
import type { BaseModel } from "./index.ts";

export interface StudentDocument extends Document{
    name: string;
    phone: number;
    college: string;
    degree: string;
    branch: string;
    graduation_year: number;
    skills: string;
    resume_url: string;
    linkedin_url: string;
    github_url: string;
}

export interface StudentModel extends BaseModel<StudentDocument> {}