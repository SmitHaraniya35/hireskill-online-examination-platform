import Joi  from "joi";
import { uuidv4Rule } from "./index.validator.ts";

export const TestCaseSchema = Joi.object({
    id: uuidv4Rule.optional(),
    problem_id: Joi.string().required(),
    input: Joi.string().required(),
    expected_output: Joi.string().required(),
    is_hidden: Joi.boolean().required()
});