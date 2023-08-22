import connection from "../../config/database";
import { User } from "../models/user.entity";
import UserDetails from "../types/createUser.type";
import * as bcrypt from "bcrypt";

class UserService {
  private repository = connection.getRepository(User);

  constructor() {}

  public async createUser(userDetails: UserDetails) {
    const { email, password, fullName } = userDetails;
    if (!email || !password || !fullName) {
      // throw an error
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.repository.save({
      ...userDetails,
      password: hashedPassword,
    });
  }
}

export default UserService;
