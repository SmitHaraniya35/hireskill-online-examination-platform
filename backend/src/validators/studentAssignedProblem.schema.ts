import Joi from "joi";
import { uuidv4Rule } from "./index.validator.ts";

export const StudentAssignedProblemDraftSchema = Joi.object({
    id: uuidv4Rule.required(),
    last_saved_code: Joi.string().required(),
    last_language: Joi.string().required()
});