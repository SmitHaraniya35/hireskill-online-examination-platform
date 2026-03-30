import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import * as CodingProblemController from "../controllers/codingProblem.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { CodingProblemSchema, CodinProblemWithTestCasesSchema } from "../validators/codingProblem.schema.ts";
import { IdSchema } from "../validators/index.validator.ts";

const router = express();

router.post("/create-coding-problem", authMiddleware, validateRequest(CodingProblemSchema), CodingProblemController.createCodingProblem);
router.post("/create-coding-problem-with-testcases", authMiddleware, validateRequest(CodinProblemWithTestCasesSchema), CodingProblemController.createCodingProblemWithTestCases);
router.get("/get-coding-problem-with-testcases/:id", validateRequest(IdSchema), CodingProblemController.getCodingProblemWithTestCases);
router.patch("/update-coding-problem-with-testcases/:id", authMiddleware, validateRequest(CodinProblemWithTestCasesSchema), CodingProblemController.updateCodingProblemWithTestCases)
router.get("/get-coding-problem/:id", validateRequest(IdSchema), CodingProblemController.getCodingProblemById);
router.get("/get-all-coding-problems", authMiddleware, CodingProblemController.getAllCodingProblems);
router.put("/update-coding-problem/:id", authMiddleware, validateRequest(CodingProblemSchema), CodingProblemController.updateCodingProblem);
router.delete("/delete-coding-problem/:id", authMiddleware, validateRequest(IdSchema), CodingProblemController.deleteCodingProblem);

export default router;
