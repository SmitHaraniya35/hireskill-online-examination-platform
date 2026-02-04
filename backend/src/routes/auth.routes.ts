import express from "express";
import * as AdminController from "../controllers/auth.controller.ts";
import { loginSchema, createAdminSchema, resetPasswordSchema, otpSchema } from "../validators/auth.schema.ts";
import { validateRequest } from "../validators/request.validate.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), AdminController.login);
router.get("/me", authMiddleware, AdminController.getMe);
router.post("/create-admin", validateRequest(createAdminSchema), AdminController.createAdmin);
router.get("/refresh-token", validateRequest(), AdminController.refreshToken);
router.post("/forgot-password", validateRequest(), AdminController.forgotPassword);
router.post("/verify-otp", validateRequest(otpSchema), AdminController.verifyOtp);
router.post("/reset-password", validateRequest(resetPasswordSchema), AdminController.resetPassword);
router.post("/logout", authMiddleware, AdminController.logout);

export default router;
