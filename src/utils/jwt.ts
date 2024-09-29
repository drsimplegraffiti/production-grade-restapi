import jwt from "jsonwebtoken";

export class JwtService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor() {
    this.accessTokenSecret = process.env.ACCESS_JWT_SECRET as string;
    this.refreshTokenSecret = process.env.REFRESH_JWT_SECRET as string;
  }

  signAccessToken(payload: object) {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: "15m" });
  }
  verifyAccessToken(token: string) {
    return jwt.verify(token, this.accessTokenSecret);
  }

  signRefreshToken(payload: object) {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: "1d" });
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshTokenSecret);
  }
}
