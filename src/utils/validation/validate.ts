import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../../dto/responses";

export class Validator {
  static validate(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);

      if (error) {
        const response = ErrorResponse.create(
          422,
          error.details[0].message.replace(/['"]+/g, "")
        );
        return res.status(response.statusCode).json(response);
      }

      next();
    };
  }
}
