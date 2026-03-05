import express from "express";
import * as SubmissionController from "../controllers/submission.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { Judge0SubmissionIdSchema, SubmitCodeSchema } from "../validators/submission.schema.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = express();

router.post("/run", validateRequest(), SubmissionController.runCode);
router.post("/submit", validateRequest(SubmitCodeSchema), SubmissionController.submitCode);
router.get("/:submissionId", validateRequest(Judge0SubmissionIdSchema), SubmissionController.fetchOutput);
router.get("/get-submission-by-student-attempt-id/:studentAttemptId",  validateRequest(), SubmissionController.getSubmissionsByStudentAttemptId);

export default router;