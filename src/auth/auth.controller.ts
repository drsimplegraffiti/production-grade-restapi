import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { IUser, IUserLogin } from "./auth.interface";
import {
  BadRequest,
  Conflict,
  NotFound,
  Unauthorized,
} from "../exceptions/exceptions";
import { DataResponse } from "../dto/responses";
import PasswordHelper from "../utils/hash";
import { JwtService } from "../utils/jwt";
import { bindAllMethods } from "../utils/bindmethod";
import emailEmitter from "../utils/emitter";

export class AuthController {
  private readonly jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
    bindAllMethods(this);
  }

  async registerUser(req: Request, res: Response) {
    const data: IUser = req.body;

    const existingUser = await AuthService.findByEmail(data.email);
    if (existingUser)
      throw new Conflict(
        `User with the email ${existingUser.email} already exist`
      );

    const file = req.file;
    if (!file) {
      throw new BadRequest("please enter a file. format is png/jpeg");
    } else {
      data.profilePic = file.path;
    }

    const savedUser = await AuthService.createUser(data);

    emailEmitter.emit("welcome-email", {
      email: savedUser?.email,
      name: savedUser?.name,
    });

    const response = DataResponse.create(
      201,
      "user created successfully",
      savedUser
    );
    // const response = SuccessResponse.create(201, "user created successfully");
    return res.status(response.statusCode).json(response);
  }

  async loginUser(req: Request, res: Response) {
    const data: IUserLogin = req.body;

    const userExist = await AuthService.findByEmail(data.email);
    if (!userExist) {
      throw new NotFound(`User with the email ${data.email} does not exist`);
    }

    const passwordMatch = await PasswordHelper.comparePassword(
      data.password,
      userExist.password
    );
    if (!passwordMatch) throw new BadRequest("invalid credentials");

    let payload = {
      id: userExist.id,
    };
    const access_token = this.jwtService.signAccessToken(payload);
    const refresh_token = this.jwtService.signRefreshToken(payload);
    const response = DataResponse.create(200, "user log in successfully", {
      access_token,
      refresh_token,
    });
    return res.status(response.statusCode).json(response);
  }

  async me(req: Request, res: Response) {
    const id = req.user.id;
    const userExist = await AuthService.findById(id);
    if (!userExist) {
      throw new NotFound(`User with the ${id} does not exist`);
    }

    const response = DataResponse.create(
      200,
      "user profile found in successfully",
      userExist
    );
    return res.status(response.statusCode).json(response);
  }
}
