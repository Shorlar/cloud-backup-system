import express from "express";
import UserService from "../services/user.service";
import UserDetails from "../types/createUser.type";

class AuthController {
  public path = "/auth";
  public router = express.Router();
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.register);
  }

  private register = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userDetails: UserDetails = request.body;
    const user = await this.userService.createUser(userDetails);
    response.send(user);
  };
}
export default AuthController;
