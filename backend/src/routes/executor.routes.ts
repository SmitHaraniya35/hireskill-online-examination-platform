import express from "express";
import { validateRequest } from "../validators/request.validator.ts";
import * as executorController from "../controllers/executor.controller.ts";

const router = express();

router.post("/run", validateRequest(), executorController.runCode);
router.post("/submit", validateRequest(), executorController.submitCode);

export default router;