import express from "express";
import * as SubmissionController from "../controllers/submission.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { IdSchema } from "../validators/index.validator.ts";

const router = express();

router.get("/get-submission/:id", validateRequest(IdSchema), SubmissionController.getSubmissionById);

export default router;