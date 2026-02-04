import type { Document } from "mongoose";
import type { BaseModel } from "./index.ts";

export interface StudentProfileDocument extends Document{
    user_id: string;
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

export interface StudentProfileModel extends BaseModel<StudentProfileDocument> {}