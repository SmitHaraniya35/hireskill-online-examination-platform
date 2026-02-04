import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).options({ abortEarly: false });

export const createAdminSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(8).required().label("Password"),
}).options({ abortEarly: false });

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(8).required(),
}).options({ abortEarly: true });

export const otpSchema = Joi.object({
  otp: Joi.string().length(6).required()
});