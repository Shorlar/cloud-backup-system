import connection from "../../config/database";
import { User } from "../models/user.entity";
import UserDetails from "../types/createUser.type";

class UserService {
  private repository = connection.getRepository(User);

  constructor() {}

  public async createUser(userDetails: UserDetails) {
    const { email, password, fullName } = userDetails;
    if (!email || !password || !fullName) {
      // throw an error
    }
    // encode password and return token
    return await this.repository.save(userDetails);
  }
}

export default UserService;
