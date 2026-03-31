import Joi from "joi";
import { uuidv4Rule } from "./index.validator.ts";

export const ValidateStudentAttemptSchema = Joi.object({
    email: Joi.string().email().required(),
    test_id: uuidv4Rule.required(),
});

export const CreateStudentAttemptSchema = Joi.object({
    test_id: uuidv4Rule.required(),
    student_id: uuidv4Rule.required(),
});