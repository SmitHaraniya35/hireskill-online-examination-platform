import Joi from "joi";

export const ValidateStudentAttemptSchema = Joi.object({
    email: Joi.string().email().required()
});