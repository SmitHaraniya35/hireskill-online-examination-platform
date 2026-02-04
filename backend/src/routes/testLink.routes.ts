import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import * as TestLinkController from "../controllers/testLink.controller.ts";
import { validateRequest } from "../validators/request.validate.ts";
import { TestLinkSchema } from "../validators/testLink.schema.ts";

const router = express();

router.post("/create-test-link", authMiddleware, validateRequest(TestLinkSchema), TestLinkController.createTestLink);
router.get("/get-test-link-details/:id", authMiddleware, validateRequest(), TestLinkController.getTestLinkById);
router.get("/get-all-test-links", authMiddleware, TestLinkController.getAllTestLink);
router.put("/update-test-link/:id", authMiddleware, validateRequest(TestLinkSchema), TestLinkController.updateTestLink);
router.delete("/delete-test-link/:id", authMiddleware, validateRequest(),TestLinkController.deleteTestLink);

export default router;
