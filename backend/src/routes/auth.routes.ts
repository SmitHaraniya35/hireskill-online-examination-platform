import express from "express";
import * as AdminController from "../controllers/auth.controller.ts";
import { LoginSchema, CreateAdminSchema, ResetPasswordSchema, OtpSchema, ForgotPasswordSchema } from "../validators/auth.schema.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/login", validateRequest(LoginSchema), AdminController.login);
router.get("/me", authMiddleware, AdminController.getMe);
router.post("/create-admin", validateRequest(CreateAdminSchema), AdminController.createAdmin);
router.get("/refresh-token", validateRequest(), AdminController.refreshToken);
router.post("/forgot-password", validateRequest(ForgotPasswordSchema), AdminController.forgotPassword);
router.post("/verify-otp", validateRequest(OtpSchema), AdminController.verifyOtp);
router.post("/reset-password", validateRequest(ResetPasswordSchema), AdminController.resetPassword);
router.post("/logout", authMiddleware, AdminController.logout);

export default router;
