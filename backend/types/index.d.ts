import type { Response, Request } from "express";
import "express-serve-static-core";
import type { UserDocument } from "../src/types/model/user.document.ts";
import type { AuthJwtPayload } from "../src/types/controller/index.ts";

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
            user?: AuthJwtPayload;
            allParams: Record<string, any>;
            validateData: any;
        }
    }
}

