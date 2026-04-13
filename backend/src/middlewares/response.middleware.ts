import type { Response, NextFunction, Request } from "express";
import { HttpStatusCode, SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/index.ts";

export default function responseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  const success = <T>(status: number) => 
    (message: string, payload?: T) => 
      res.status(status).json({
        success: true,
        message,
        payload
      });

  const failure = (status: number) => 
    (message: string, errors?: string[] | null, errorCode?: string) => 
      res.status(status).json({
        success: false,
        message,
        errors,
        errorCode
      });
    

  res.ok = <T> (
    message = SUCCESS_MESSAGES.OK,
    data?: T
  ) => success<T>(HttpStatusCode.OK)(message, data);
  
  res.created = <T> (
    message = SUCCESS_MESSAGES.CREATED,
    data?: T
  ) => success<T>(HttpStatusCode.CREATED)(message, data);

  res.badRequest = (
    message = ERROR_MESSAGES.BAD_REQUEST,
    errors = null
  ) => failure(HttpStatusCode.BAD_REQUEST)(message, errors);

  res.unauthorized = (
    message = ERROR_MESSAGES.UNAUTHORIZED,
    errorCode?: string
  ) => failure(HttpStatusCode.UNAUTHORIZED)(message, null, errorCode);

  res.notFound = (
    message = ERROR_MESSAGES.NOT_FOUND
  ) => failure(HttpStatusCode.NOT_FOUND)(message);

  res.internalServerError = (
    message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  ) => failure(HttpStatusCode.INTERNAL_SERVER_ERROR)(message);

  res.forbidden = (
    message = ERROR_MESSAGES.FORBIDDEN
  ) => failure(HttpStatusCode.FORBIDDEN)(message);

  res.httpError = (
    status,
    message
  ) => failure(status)(message);

  next();
}
