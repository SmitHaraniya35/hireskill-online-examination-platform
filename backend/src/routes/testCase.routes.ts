import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { validateRequest } from "../validators/request.validator.ts";
import * as TestCaseController from "../controllers/testCase.controller.ts";
import { TestCaseSchema } from "../validators/testCase.schema.ts";

const router = express();

router.post("/create-test-case", authMiddleware, validateRequest(TestCaseSchema), TestCaseController.createTestCase);
// router.post("/get-test-case/:id", authMiddleware, validateRequest(), TestCaseController.getTestCaseById);
router.get("/get-all-test-cases/problem/:problemId", authMiddleware, validateRequest(), TestCaseController.getAllTestCasesByProblemId);
router.put("/update-test-case/:id", authMiddleware, validateRequest(TestCaseSchema), TestCaseController.updateTestCase);
router.delete("/delete-test-case/:id", authMiddleware, validateRequest(), TestCaseController.deleteTestCase);

export default router;