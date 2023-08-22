import connection from "../../config/database";
import { User } from "../models/user.entity";
import UserDetails from "../types/createUser.type";
import * as bcrypt from "bcrypt";
import JwtService from "./jwt.services";

class UserService {
  private repository = connection.getRepository(User);
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  public async createUser(
    userDetails: UserDetails
  ): Promise<Record<string, any>> {
    const { email, password, fullName } = userDetails;
    if (!email || !password || !fullName) {
      // throw an error
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const accessToken = this.jwtService.generateToken(email);
    await this.repository.save({
      ...userDetails,
      password: hashedPassword,
    });
    return { token: accessToken };
  }
}

export default UserService;
