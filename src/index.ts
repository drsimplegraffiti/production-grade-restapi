import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import homeRoute from "./health/home.routes";
import authRoute from "./auth/auth.routes";
import { errorHandler, notFound } from "./exceptions/globalerror";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.handleErrors();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use("/", homeRoute);
    this.app.use("/api/v1/auth", authRoute);
  }

  private handleErrors(): void {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }
}

export default new App().app;
