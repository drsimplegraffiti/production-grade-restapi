import { NextFunction, Request, Response } from "express";

// export const asyncHandler = (controller: Function) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await controller(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

export class AsyncHandler {
  public static handle(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
