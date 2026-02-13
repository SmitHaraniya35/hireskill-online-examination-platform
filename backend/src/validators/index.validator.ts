import Joi from "joi";

export const emailRule = Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .lowercase()
    .trim()
    .messages({
        "string.pattern.base": "Only Gmail addresses are allowed",
        "string.email": "Invalid email format",
        "string.empty": "Email is required",
    });

export const passwordRule = Joi.string()
  .min(8)
  .max(32)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.pattern.base":  "Password must contain at least one letter and one number",
    "string.empty": "Password is required"
  });