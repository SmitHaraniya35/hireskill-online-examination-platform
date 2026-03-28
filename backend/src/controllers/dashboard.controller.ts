import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/controller/index.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import { ERROR_MESSAGES, HttpStatusCode, SUCCESS_MESSAGES } from "../constants/index.ts";
import { getAllTestsAnalyticsService, getSingleTestAnalyticsService } from "../services/dashboard.service.ts";

export const getAllTestsAnalytics = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await getAllTestsAnalyticsService();
        res.ok(data, SUCCESS_MESSAGES.ALL_OVER_TESTS_ANALYTICS_FETCHED);
    } catch (err: any) {
        next(err);
    }
};

export const getSingleTestAnalytics = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.allParams;
        if(!id){
            throw new HttpError(ERROR_MESSAGES.TEST_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }

        const data = await getSingleTestAnalyticsService(id);
        res.ok(data, SUCCESS_MESSAGES.TEST_ANALYTICS_FETCHED);
    } catch (err: any) {
        next(err);
    }
};