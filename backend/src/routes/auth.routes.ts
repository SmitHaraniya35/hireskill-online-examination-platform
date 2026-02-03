import express from "express";
import * as AdminController from "../controllers/auth.controller.ts";
import { loginSchema, createAdminSchema } from "../validators/auth.schema.ts";
import { validateRequest } from "../validators/request.validate.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), AdminController.login);
router.post("/create-admin", validateRequest(createAdminSchema), AdminController.createAdmin);
router.get("/refresh-token", AdminController.refreshToken);

router.post("/forgot-password", AdminController.forgotPassword);
router.post("/reset-password", AdminController.resetPassword);
router.post("/logout", AdminController.logout);

// Example protected route
// router.get("/profile", authMiddleware, (req, res) => {
//   res.json({ message: "Admin authorized", adminId: req.user.id });
// });

export default router;
