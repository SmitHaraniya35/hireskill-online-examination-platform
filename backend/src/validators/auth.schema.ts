import Joi from "joi";
import { emailRule, passwordRule } from "./index.validator.ts";

export const loginSchema = Joi.object({
  email: emailRule.required(),
  password: passwordRule.required(),
}).options({ abortEarly: false });

export const createAdminSchema = Joi.object({
  email: emailRule.label("Email").required(),
  password: passwordRule.label("Password").required(),
}).options({ abortEarly: false });

export const resetPasswordSchema = Joi.object({
  email: emailRule.required(),
  newPassword: passwordRule.required(),
}).options({ abortEarly: true });

export const otpSchema = Joi.object({
  email: emailRule.required(), 
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "string.empty": "OTP is required",
    })
    .required()
});