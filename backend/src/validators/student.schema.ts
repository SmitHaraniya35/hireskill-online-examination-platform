import Joi from "joi";

export const StudentSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    phone: Joi.string().length(10).required(),
    // college: string;
    // degree: string;
    // branch: string;
    // graduation_year: number;
    // skills: string;
    // resume_url: string;
    // linkedin_url: string;
    // github_url: string;
});