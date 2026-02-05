import Joi from "joi";

export const TestSchema = Joi.object({
    id: Joi.string().optional(),
    title: Joi.string().required(),
    duration_minutes: Joi.number().required(),
    expiration_at: Joi.string().length(20).required()
}); 