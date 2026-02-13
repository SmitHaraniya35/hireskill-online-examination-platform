import Joi from "joi";
import { uuidv4Rule } from "./index.validator.ts";

export const TestSchema = Joi.object({
    id: uuidv4Rule.optional(),
    title: Joi.string().required(),
    duration_minutes: Joi.number().required(),
    expiration_at: Joi.date()
        .iso()
        .messages({
            "date.base": "Invalid date format",
            "date.format": "Date must be in ISO format",
        })
}); 

export const StartTestScehma = Joi.object({
    test_id: uuidv4Rule.required(),
    student_id: uuidv4Rule.required()
})