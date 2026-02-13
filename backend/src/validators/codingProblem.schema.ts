import Joi from "joi";

export const CodingProblemSchema = Joi.object({
    id: Joi.string().optional(),
    title: Joi.string().required(),
    difficulty: Joi.string().required(),
    topic: Joi.array().items(Joi.string().required()).required(),
    problem_description: Joi.string().required(),
    problem_description_image: Joi.string().required(),
    constraint: Joi.string().required(),
    input_format: Joi.string().required(),
    output_format: Joi.string().required(),
    sample_input: Joi.string().required(),
    sample_output: Joi.string().required(),
    basic_code_layout: Joi.string().required(),
})

export const CodinProblemWithTestCasesSchema = Joi.object({
    id: Joi.string().optional(),
    title: Joi.string().required(),
    difficulty: Joi.string().required(),
    topic: Joi.array().items(Joi.string().required()).required(),
    problem_description: Joi.string().required(),
    problem_description_image: Joi.string().required(),
    constraint: Joi.string().required(),
    input_format: Joi.string().required(),
    output_format: Joi.string().required(),
    basic_code_layout: Joi.string().required(),
    testCases: Joi.array().items(
        Joi.object().keys({
            id: Joi.string().optional(),
            input: Joi.string().required(),
            expected_output: Joi.string().required(),
            is_hidden: Joi.boolean().required()
        })
    )
})