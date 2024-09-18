import { Router } from "express";
import { HomeController } from "./home.controller";

class HomeRouter {
  public router: Router;
  private homeController: HomeController;

  constructor() {
    this.router = Router();
    this.homeController = new HomeController();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/", this.homeController.healthCheck);
  }
}

export default new HomeRouter().router;
