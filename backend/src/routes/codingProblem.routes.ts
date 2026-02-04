import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import * as CodingProblemController from "../controllers/codingProblem.Controller.ts";
import { validateRequest } from "../validators/request.validate.ts";
import { CodingProblemSchema } from "../validators/codingProblem.schema.ts";

const router = express();

router.post("/create-coding-problem", authMiddleware, validateRequest(CodingProblemSchema), CodingProblemController.createCodingProblem);
router.get("/get-coding-problem/:id", authMiddleware, validateRequest(), CodingProblemController.getCodingProblemById);
router.get("/get-all-coding-problems", authMiddleware, CodingProblemController.getAllCodingProblems);
router.put("/update-coding-problem/:id", authMiddleware, validateRequest(), CodingProblemController.updateCodingProblem);
router.delete("/delete-coding-problem/:id", authMiddleware, validateRequest(),CodingProblemController.deleteCodingProblem);

export default router;
