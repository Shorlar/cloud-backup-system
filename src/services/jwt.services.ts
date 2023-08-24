import { sign, verify } from "jsonwebtoken";
import HttpException from "../exception/http.exception";

class JwtService {
  private key = process.env.JWT_KEY;

  constructor() {}

  public generateToken(email: string): string {
    if (this.key) {
      const token: string = sign({ email }, this.key, {
        expiresIn: "1h",
      });
      return token;
    }
    console.log("Unable to get secret key");
    throw new HttpException(500, "");
  }

  public verifyToken(token: string) {
    if (this.key) {
      try {
        const email = verify(token, this.key);
        return email;
      } catch (error) {
        throw new HttpException(400, "Invalid or missing token");
      }
    }
  }
}

export default JwtService;
