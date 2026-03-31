import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import * as DashboardController from "../controllers/dashboard.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { IdSchema } from "../validators/index.validator.ts";

const router = express();

router.get("/test/global", authMiddleware, validateRequest(), DashboardController.getAllTestsAnalytics);
router.get("/test/:id", authMiddleware, validateRequest(IdSchema), DashboardController.getSingleTestAnalytics);

export default router;