import Joi from "joi";
import { uuidv4Rule } from "./index.validator.ts";

export const SubmissionSchema = Joi.object({
    student_attempt_id: uuidv4Rule.required(),
    problem_id: uuidv4Rule.required(),
    language: Joi.string().required(),
    source_code: Joi.string().required(),
    total_test_cases: Joi.number().integer().required(),
    passed_test_cases: Joi.number()
        .integer()
        .min(0)
        .max(Joi.ref("total_test_cases"))
        .required()
        .messages({
            "number.max":
                "Passed test cases cannot exceed total test cases",
        }),
    status: Joi.string().required(),
    execution_time: Joi.string().optional(),
    memory_used: Joi.string().optional(),
});

export const SubmitCodeSchema = Joi.object({
    source_code: Joi.string().required(),
    language_id: Joi.string().required(),
    problem_id: uuidv4Rule.required(),
});

export const Judge0SubmissionIdSchema = Joi.object({
    submissionId: Joi.string().required()
});