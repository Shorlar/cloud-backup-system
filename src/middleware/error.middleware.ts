import { NextFunction, Request, Response } from "express";
import HttpException from "../exception/http.exception";

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "An Error Occured";
  response.status(status).send({
    status,
    message,
  });
}
export default errorMiddleware;
