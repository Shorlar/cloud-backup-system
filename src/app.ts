import express from "express";
import * as bodyParser from "body-parser";
import AuthController from "./controllers/auth.controller";

class App {
  public app: express.Application;
  public port: number;
  private authController: AuthController;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.authController = new AuthController();
    this.initializeMiddlewares();
    this.initializeControllers([this.authController]);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

export default App;
