import Joi from "joi";
import { uuidv4Rule } from "./index.validator.ts";

export const TestSchema = Joi.object({
    id: uuidv4Rule.optional(),
    title: Joi.string().required(),
    duration_minutes: Joi.number().required(),
    start_at: Joi.date()
        .iso()
        .messages({
            "date.base": "Invalid date format",
            "date.format": "Date must be in ISO format",
        }).required(),
    expiration_at: Joi.date()
        .iso()
        .messages({
            "date.base": "Invalid date format",
            "date.format": "Date must be in ISO format",
        }).required(),
    count_of_total_problem: Joi.number().required(),
    count_of_easy_problem: Joi.number().required(),
    count_of_medium_problem: Joi.number().required(),
    count_of_hard_problem: Joi.number().required(),
    coding_problem_ids: Joi.array().items(Joi.string().uuid())
}).custom((value, helpers) => {
  const sum =
        value.count_of_easy_problem +
        value.count_of_medium_problem +
        value.count_of_hard_problem;

    if (sum !== value.count_of_total_problem) {
        return helpers.error("any.custom");
    }

    return value;
}).messages({
    "any.custom": "Sum of easy, medium, and hard problems must equal count_of_total_problem"
}); 

export const StartTestScehma = Joi.object({
    slug: Joi.string().required(),
    test_id: uuidv4Rule.required(),
    student_id: uuidv4Rule.required()
});

export const GetTestDataByStudentAttemptIdSchema = Joi.object({
    slug: Joi.string().required(),
    studentAttemptId: uuidv4Rule.required()
});