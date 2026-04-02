import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { upload } from "../config/cloudinary.config.ts";
import * as uploadController from "../controllers/upload.controller.ts";

const router = express();

router.post("/image", authMiddleware, upload.single("image"), uploadController.uploadImage);
router.delete("/image", authMiddleware, uploadController.deleteImage);

export default router;
