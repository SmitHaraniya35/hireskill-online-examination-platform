import type { Response, Request } from "express";
import "express-serve-static-core";

declare global {
    namespace Express {
        interface Response {
            ok<T>(data?: T, message?: string): this;
            created<T>(data?: T, message?: string): this;
            
            badRequest(message?: string): this;
            unauthorized(message?: string): this;
            notFound(message?: string): this;
            internalError(message?: string): this;
        }

        interface Request {
            allParams: Record<string, any>;
            validateData: any
        }
    }
}

