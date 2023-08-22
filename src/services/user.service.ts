import connection from "../../config/database";
import { User } from "../models/user.entity";
import UserDetails from "../types/createUser.type";
import * as bcrypt from "bcrypt";
import JwtService from "./jwt.services";
import SignInDetails from "../types/signIn.types";
import HttpException from "../exception/http.exception";
import { DatabaseErrorCode } from "../enums/db.enum";

class UserService {
  private repository = connection.getRepository(User);
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  public async createUser(
    userDetails: UserDetails
  ): Promise<Record<string, any> | undefined> {
    const { email, password, fullName } = userDetails;
    if (!email || !password || !fullName) {
      throw new HttpException(
        400,
        "email, password or fullName is not provided"
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const accessToken = this.jwtService.generateToken(email);
    try {
      await this.repository.save({
        ...userDetails,
        password: hashedPassword,
      });
      return { token: accessToken };
    } catch (error: any) {
      const message =
        error.code === DatabaseErrorCode.DUPLICATE_KEY
          ? "email already exist"
          : "";
      throw new HttpException(500, message);
    }
  }

  public async getUser(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user;
  }

  public async signIn(userDetails: SignInDetails) {
    const { email, password } = userDetails;
    if (!email || !password) {
      throw new HttpException(400, "Invalid Credentials");
    }
    const user = await this.getUser(email);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const accessToken = this.jwtService.generateToken(email);
        return { token: accessToken };
      } else {
        throw new HttpException(400, "Invalid Credentials");
      }
    }
    throw new HttpException(400, "Invalid Credentials");
  }
}

export default UserService;
