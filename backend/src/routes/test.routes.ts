import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import * as TestController from "../controllers/test.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { StartTestScehma, TestSchema } from "../validators/test.schema.ts";
import { validateTestLink } from "../middlewares/testLink.middleware.ts";
import { SubmissionSchema } from "../validators/submission.schema.ts";
import { IdSchema } from "../validators/index.validator.ts";

const router = express();

router.post("/create-test", authMiddleware, validateRequest(TestSchema), TestController.createTest);
router.get("/get-test-details/:id", authMiddleware, validateRequest(IdSchema), TestController.getTestById);
router.get("/get-all-tests", authMiddleware, TestController.getAllTests);
router.put("/update-test/:id", authMiddleware, validateRequest(TestSchema), TestController.updateTest);
router.delete("/delete-test/:id", authMiddleware, validateRequest(IdSchema),TestController.deleteTest);
router.put("/toggle-activation/:id", authMiddleware, validateRequest(IdSchema), TestController.toggleTestActivation);
router.put("/toggle-public-status/:id",  validateRequest(IdSchema), TestController.toggleTestPublicStatus);

router.get("/:slug/start", validateRequest(StartTestScehma), validateTestLink, TestController.startTest);
// router.get("/:slug/student-attempt-id/:studentAttemptId", validateRequest(IdSchema), TestController.getTestDataByStudentAttemptId);
router.post("/:slug/finish", validateRequest(SubmissionSchema), TestController.finishTest);
router.get("/:slug", validateTestLink, TestController.getTestById);

export default router;
