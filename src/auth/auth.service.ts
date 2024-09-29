import prisma from "../db/connector";
import PasswordHelper from "../utils/hash";
import { IUser } from "./auth.interface";

export class AuthService {
  public static async findById(id: number) {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  public static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  public static async createUser(data: IUser) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await PasswordHelper.hashPassword(data.password),
        profilePic: data.profilePic,
      },
    });
  }
}
