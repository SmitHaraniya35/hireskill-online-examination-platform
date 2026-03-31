import Joi from "joi";

export const RunCodeSchema = Joi.object({
    language: Joi.string().required(),
    code: Joi.string().required(),
    testCases: Joi.array().items(Joi.object({
        testCaseId: Joi.string().required(),
        input: Joi.string().required(),
        expected: Joi.string().required(),
    })).required()
});

export const SubmitCodeSchema = Joi.object({
    assignedProblemId: Joi.string().required(),
    problemId: Joi.string().required(),
    language: Joi.string().required(),
    code: Joi.string().required(),
});