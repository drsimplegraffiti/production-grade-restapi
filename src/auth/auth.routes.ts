import { Router } from "express";
import { AuthController } from "./auth.controller";
import { Validator } from "../utils/validation/validate";
import {
  loginUserSchema,
  registerUserSchema,
} from "../utils/validation/schema";
import { singleUpload } from "../utils/filehandler/fileupload";
import { AsyncHandler } from "../utils/hof";
import { bindAllMethods } from "../utils/bindmethod";
import { AuthMiddleware } from "../middlewares/auth";

class AuthRouter {
  public router: Router;
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
    bindAllMethods(this);
  }

  private initRoutes() {
    this.router.post(
      "/register",
      singleUpload, //TODO: optimzed by using cluster, child process
      Validator.validate(registerUserSchema),
      AsyncHandler.handle(this.authController.registerUser)
    );
    this.router.post(
      "/login",
      Validator.validate(loginUserSchema),
      AsyncHandler.handle(this.authController.loginUser)
    );

    this.router.get(
      "/me",
      this.authMiddleware.authenticate,
      AsyncHandler.handle(this.authController.me)
    );
  }
}

export default new AuthRouter().router;
