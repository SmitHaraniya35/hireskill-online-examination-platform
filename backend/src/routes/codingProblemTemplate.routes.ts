import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { IdSchema } from "../validators/index.validator.ts";
import * as CodingProblemTemplateController from "../controllers/codingProblemTemplate.controller.ts";

const router = express();

router.delete("/delete-coding-problem-template/:id", authMiddleware, validateRequest(IdSchema), CodingProblemTemplateController.deleteCodingProblemTemplateById);

export default router;