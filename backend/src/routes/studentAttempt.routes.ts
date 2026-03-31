import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { validateRequest } from "../validators/request.validator.ts";
import * as StudentAttemptController from "../controllers/studentAttempt.controller.ts";
import { IdSchema } from "../validators/index.validator.ts";
import { ValidateStudentAttemptSchema, CreateStudentAttemptSchema } from "../validators/studentAttempt.schema.ts";

const router = express();

router.post("/create-student-attempt", validateRequest(CreateStudentAttemptSchema), StudentAttemptController.createStudentAttempt);
router.get("/get-student-attempt/:id", validateRequest(IdSchema), StudentAttemptController.getStudentAttemptById);
router.get("/get-student-attempts-details/:testId", authMiddleware, validateRequest(), StudentAttemptController.getStudentAttemptsDetailsByTestId);
router.delete("/delete-student-attempt/:id", authMiddleware, validateRequest(IdSchema), StudentAttemptController.deleteStudentAttempt);
router.get("/get-student-attempt-submission-details-and-result/:id", validateRequest(IdSchema), StudentAttemptController.getStudentAttemptSubmissionDetailsAndResultById);

router.get("/validate-student-attempt/:id", validateRequest(IdSchema), StudentAttemptController.validateStudentAttemptById);
router.post("/validate-student-attempt-by-email-and-test-id", validateRequest(ValidateStudentAttemptSchema), StudentAttemptController.validateStudentAttemptByEmailAndTestId);

export default router;