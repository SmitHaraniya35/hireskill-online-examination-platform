import type { NextFunction, Request, Response } from "express"
import { HttpError } from "../utils/httpError.utils.ts"

export const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(err instanceof HttpError){
        return res.httpError(err.statusCode, err.message);
    }

    return res.internalServerError();
}