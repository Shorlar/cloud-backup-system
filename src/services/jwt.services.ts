import { sign, verify } from "jsonwebtoken";

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
    throw new Error("Unable to get secret key");
  }

  public verifyToken(token: string) {
    if (this.key) {
      const email = verify(token, this.key);
      return email;
    }
  }
}

export default JwtService;
