import connection from "../../config/database";
import { User } from "../models/user.entity";
import UserDetails from "../types/createUser.type";
import * as bcrypt from "bcrypt";
import JwtService from "./jwt.services";
import SignInDetails from "../types/signIn.types";

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

  public async getUser(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user;
  }

  public async signIn(userDetails: SignInDetails) {
    const { email, password } = userDetails;
    if (!email || !password) {
      // hanlde error
    }
    const user = await this.getUser(email);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password,user.password);
      if(isPasswordValid){
        const accessToken = this.jwtService.generateToken(email);
        return { token: accessToken };
      }else{
        throw new Error("Invalid credentials")
      }
    }
    // throw error
  }
}

export default UserService;
