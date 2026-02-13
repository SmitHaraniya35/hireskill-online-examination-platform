import express from "express";
import * as SubmissionController from "../controllers/submission.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { Judge0SubmissionIdSchema, SubmitCodeSchema } from "../validators/submission.schema.ts";

const router = express();

router.post("/run", validateRequest(), SubmissionController.runCode);
router.post("/submit", validateRequest(SubmitCodeSchema), SubmissionController.submitCode);
router.get("/:submissionId", validateRequest(Judge0SubmissionIdSchema), SubmissionController.fetchOutput);

export default router;