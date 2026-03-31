import express from "express";
import { validateRequest } from "../validators/request.validator.ts";
import * as executorController from "../controllers/executor.controller.ts";
import { RunCodeSchema, SubmitCodeSchema } from "../validators/executor.schema.ts";

const router = express();

router.post("/run", validateRequest(RunCodeSchema), executorController.runCode);
router.post("/submit", validateRequest(SubmitCodeSchema), executorController.submitCode);

export default router;