import type { Response, Request } from "express";
import "express-serve-static-core";
import type { UserDocument } from "../src/types/model/user.document.ts";
import type { AuthJwtPayload } from "../src/types/controller/index.ts";
import type { ClientDocument } from "../src/types/model/client.document.ts";

declare global {
    namespace Express {
        interface Response {
            ok<T>(data?: T, message?: string): this;
            created<T>(data?: T, message?: string): this;
            
            badRequest(message?: string): this;
            unauthorized(message?: string): this;
            notFound(message?: string): this;
            internalServerError(message?: string): this;
            forbidden(message?: string): this;
            httpError(status: number, message: string): this;
        }

        interface Request {
            client?: ClientDocument; 
            user?: AuthJwtPayload;
            allParams: Record<string, any>;
            validateData: any;
        }
    }
}

