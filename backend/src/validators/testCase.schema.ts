import Joi  from "joi";

export const TestCaseSchema = Joi.object({
    id: Joi.string().optional(),
    problem_id: Joi.string().required(),
    input: Joi.string().required(),
    expected_output: Joi.string().required(),
    is_hidden: Joi.boolean().required()
});