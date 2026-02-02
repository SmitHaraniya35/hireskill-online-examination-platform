import type { Response, NextFunction, Request } from "express";
import { HttpStatusCode, SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/index.ts";

export default function responseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  const success = <T>(status: number) => 
    (payload: T, message: string) => 
      res.status(status).json({
        success: true,
        message,
        payload
      });

  const failure = (status: number) => 
    (message: string) => 
      res.status(status).json({
        success: false,
        message
      });
    

  res.ok = <T> (
    data: T, 
    message = SUCCESS_MESSAGES.OK
  ) => success<T>(HttpStatusCode.OK)(data, message);
  
  res.created = <T> (
    data: T, 
    message = SUCCESS_MESSAGES.CREATED
  ) => success(HttpStatusCode.CREATED)(data, message);

  res.badRequest = (
    message = ERROR_MESSAGES.BAD_REQUEST
  ) => failure(HttpStatusCode.BAD_REQUEST)(message);

  res.unauthorized = (
    message = ERROR_MESSAGES.UNAUTHORIZED
  ) => failure(HttpStatusCode.UNAUTHORIZED)(message);

  res.notFound = (
    message = ERROR_MESSAGES.NOT_FOUND
  ) => failure(HttpStatusCode.NOT_FOUND)(message);

  res.internalError = (
    message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  ) => failure(HttpStatusCode.INTERNAL_SERVER_ERROR)(message);

  next();
}
