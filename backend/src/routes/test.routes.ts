import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import * as TestController from "../controllers/test.controller.ts";
import { validateRequest } from "../validators/request.validate.ts";
import { TestSchema } from "../validators/test.schema.ts";
import { validateTestLink } from "../middlewares/testLink.middleware.ts";

const router = express();

router.post("/create-test", authMiddleware, validateRequest(TestSchema), TestController.createTest);
router.get("/get-test-details/:id", authMiddleware, validateRequest(), TestController.getTestById);
router.get("/get-all-tests", authMiddleware, TestController.getAllTests);
router.put("/update-test/:id", authMiddleware, validateRequest(TestSchema), TestController.updateTest);
router.delete("/delete-test/:id", authMiddleware, validateRequest(),TestController.deleteTest);

router.get("/:slug/start", validateRequest(), validateTestLink, TestController.startTest);
router.get("/:slug", validateTestLink, TestController.getTestById);

export default router;
