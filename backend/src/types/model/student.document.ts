import type { BaseDocument, BaseModel } from "./index.ts";

export interface StudentDocument extends BaseDocument{
    name: string;
    email: string;
    phone: number;
    college: string | null;
    degree: string | null;
    branch: string | null;
    graduation_year: number | null;
    skills: string | null;
    resume_url: string | null;
    linkedin_url: string | null;
    github_url: string | null;
}

export interface StudentModel extends BaseModel<StudentDocument> {}