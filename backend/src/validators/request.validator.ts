import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
import { ERROR_MESSAGES } from "../constants/index.ts";

export const validateRequest = function (schema?: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {

        req.allParams = {
            ...req.body,
            ...req.query,
            ...req.params
        }

        if(schema){
            const { error, value } = schema.validate(req.allParams, {
                abortEarly: false,
                allowUnknown: false
            });

            if (error) {
                const errors = error.details.map(err => err.message);
                return res.badRequest(
                    ERROR_MESSAGES.VALIDATION_FAILED,
                    errors
                )
            }

            req.validateData = value;
        }

        next();
    };
}
  