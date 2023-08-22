import express from "express";
import UserService from "../services/user.service";
import UserDetails from "../types/createUser.type";
import SignInDetails from "../types/signIn.types";

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
    this.router.post(`${this.path}/signIn`, this.signIn);
  }

  private register = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userDetails: UserDetails = request.body;
    try {
      const user = await this.userService.createUser(userDetails);
      response.send(user);
    } catch (error) {
      next(error)
    }
  };

  private signIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userDetails: SignInDetails = request.body;
    try {
      const accessToken = await this.userService.signIn(userDetails);
        response.send(accessToken);
    } catch (error) {
      next(error)
    }
  };
}
export default AuthController;
