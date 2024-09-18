import { Request, Response } from "express";

export class HomeController {
  healthCheck(req: Request, res: Response) {
    return res.status(200).json({ message: "Server is up" });
  }
}
