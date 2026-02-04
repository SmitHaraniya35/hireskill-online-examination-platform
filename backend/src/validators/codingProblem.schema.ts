import Joi from "joi";

export const CodingProblemSchema = Joi.object({
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