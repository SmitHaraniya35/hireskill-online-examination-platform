import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import * as CodingProblemController from "../controllers/codingProblem.controller.js";
import { validateRequest } from "../validators/request.validator.ts";
import { CodingProblemSchema, CodinProblemWithTestCasesSchema } from "../validators/codingProblem.schema.ts";
import { IdSchema } from "../validators/index.validator.ts";

const router = express();

router.post("/create-coding-problem", authMiddleware, validateRequest(CodingProblemSchema), CodingProblemController.createCodingProblem);
router.post("/create-coding-problem-with-testcases-and-templateCodes", authMiddleware, validateRequest(CodinProblemWithTestCasesSchema), CodingProblemController.createCodingProblemWithTestCasesAndTemplateCodes);
router.get("/get-coding-problem-with-testcases-and-templateCodes/:id", validateRequest(IdSchema), CodingProblemController.getCodingProblemWithTestCasesAndTemplateCodes);
router.patch("/update-coding-problem-with-testcases-and-templateCodes/:id", authMiddleware, validateRequest(CodinProblemWithTestCasesSchema), CodingProblemController.updateCodingProblemWithTestCasesAndTemplateCodes)
router.get("/get-coding-problem/:id", validateRequest(IdSchema), CodingProblemController.getCodingProblemById);
router.get("/get-all-coding-problems", authMiddleware, CodingProblemController.getAllCodingProblems);
router.put("/update-coding-problem/:id", authMiddleware, validateRequest(CodingProblemSchema), CodingProblemController.updateCodingProblem);
router.delete("/delete-coding-problem/:id", authMiddleware, validateRequest(IdSchema), CodingProblemController.deleteCodingProblem);
router.get("/get-all-supported-languages", CodingProblemController.getAllSupportedLanguages);

export default router;
