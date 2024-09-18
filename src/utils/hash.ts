import bcrypt from "bcrypt";

class PasswordHelper {
  public static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public static async compatrePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export default PasswordHelper;
