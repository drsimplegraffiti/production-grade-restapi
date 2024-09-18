import { NextFunction, Request, Response } from "express";
import { HttpError } from "./httperror";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(404, "Resource not found");
  next(error);
};

export const errorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message: error.message,
      stack: null,
    });
  }
};
