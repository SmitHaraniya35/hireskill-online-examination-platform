import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { validateRequest } from "../validators/request.validate.ts";
import * as StudentAttemptController from "../controllers/studentAttempt.controller.ts";

const router = express();

router.delete("/delete-student-attempt/:id", authMiddleware, validateRequest(), StudentAttemptController.deleteStudentAttempt);
router.get("/get-student-attempts-details/:testId", authMiddleware, validateRequest(), StudentAttemptController.getStudentAttemptsDetailsByTestId);
router.put("/submit-student-attempt/:id", validateRequest(), StudentAttemptController.submitStudentAttempt);

export default router;