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
                return res.status(400).json({
                    message: ERROR_MESSAGES.INPUT_VALIDATION_ERROR,
                    errors: error.details.map(err => err.message)
                });
            }

            req.validateData = value;
        }

        next();
    };
}
  