import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { uploadImageService, deleteImageService } from "../services/upload.service.ts";
import { SUCCESS_MESSAGES } from "../constants/index.ts";

export const uploadImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.badRequest("No image provided.");
        }

        const data = await uploadImageService(req.file.buffer);
        return res.ok(SUCCESS_MESSAGES.IMAGE_UPLOADED, data);
    } catch (err: any) {
        next(err);
    }
};

export const deleteImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.badRequest("URL is required to delete.");
        }

        await deleteImageService(url);
        return res.ok(SUCCESS_MESSAGES.IMAGE_DELETED);
    } catch (err: any) {
        next(err);
    }
};
