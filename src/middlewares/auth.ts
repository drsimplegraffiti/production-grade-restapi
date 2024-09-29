import { NextFunction, Request, Response } from "express";
import { JwtService } from "../utils/jwt";
import { Unauthorized } from "../exceptions/exceptions";

export class AuthMiddleware {
  private readonly jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
    this.authenticate = this.authenticate.bind(this);
  }

  authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization;
      if (!token) throw new Unauthorized("unauthorized"); // bearer token
      const splittedToken = token.split(" ")[1];
      if (!splittedToken) throw new Unauthorized("unauthorized");
      const decoded = this.jwtService.verifyAccessToken(splittedToken);
      if (!decoded) throw new Unauthorized("unauthorized");

      req.user = decoded;
      next();
    } catch (error) {
      // return error
      next(error);
    }
  }
}
