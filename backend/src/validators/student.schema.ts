import Joi from "joi";
import { emailRule, indianPhoneRule, uuidv4Rule } from "./index.validator.ts";

export const StudentSchema = Joi.object({
    id: uuidv4Rule.optional(),
    email: Joi.string().required(),
    name: Joi.string().required(),
    phone: indianPhoneRule.required(),
    college: Joi.string().required()
    // degree: string;
    // branch: string;
    // graduation_year: number;
    // skills: string;
    // resume_url: string;
    // linkedin_url: string;
    // github_url: string;
});

export const ImportStudentsSchema = Joi.object({
    studentList: Joi.array().items(StudentSchema).required()
});