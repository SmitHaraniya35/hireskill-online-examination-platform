import Joi from "joi";

export const SubmissionSchema = Joi.object({
    student_attempt_id: Joi.string().required(),
    problem_id: Joi.string().required(),
    language: Joi.string().required(),
    source_code: Joi.string().required(),
    total_test_cases: Joi.number(),
    passed_test_cases: Joi.number(),
    status: Joi.string(),
    execution_time: Joi.string().optional(),
    memory_used: Joi.string().optional(),
});