import Joi from "joi";
import { uuidv4Rule } from "./index.validator.ts";

export const    CodingProblemSchema = Joi.object({
    id: uuidv4Rule.optional(),
    title: Joi.string().required(),
    difficulty: Joi.string()
        .valid("Easy", "Medium", "Hard")
        .messages({
            "any.only": "Difficulty must be one of Easy, Medium, or Hard",
            "string.empty": "Difficulty is required",
        }),
    topic: Joi.array().items(Joi.string().required()).required(),
    problem_description: Joi.string().required(),
    constraint: Joi.string().required(),
    input_format: Joi.string().required(),
    output_format: Joi.string().required(),
})

export const CodinProblemWithTestCasesSchema = Joi.object({
    id: uuidv4Rule.optional(),
    title: Joi.string().required(),
    difficulty: Joi.string()
        .valid("Easy", "Medium", "Hard")
        .messages({
            "any.only": "Difficulty must be one of Easy, Medium, or Hard",
            "string.empty": "Difficulty is required",
        }),
    topic: Joi.array().items(Joi.string().required()).required(),
    problem_description: Joi.string().required(),
    constraint: Joi.string().required(),
    input_format: Joi.string().required(),
    output_format: Joi.string().required(),
    testCases: Joi.array().items(
        Joi.object().keys({
            id: uuidv4Rule.optional(),
            input: Joi.string().required(),
            expected_output: Joi.string().required(),
            image_url: Joi.string().optional(),
            is_hidden: Joi.boolean().required()
        })
    ),
    templateCodes: Joi.array().items(
        Joi.object().keys({
            language: Joi.string().valid("C++", "C", "Python", "JavaScript").required(),
            basic_code_layout: Joi.string().required()
        })
    )
})