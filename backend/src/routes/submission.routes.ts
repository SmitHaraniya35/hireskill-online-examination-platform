import express from "express";
import * as SubmissionController from "../controllers/submission.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";

const router = express();

router.post("/run", validateRequest(), SubmissionController.runCode);
router.post("/submit", validateRequest(), SubmissionController.submitCode);
router.get("/:submissionId", validateRequest(), SubmissionController.fetchOutput);

export default router;