import express from "express";
import * as bodyParser from "body-parser";
import AuthController from "./controllers/auth.controller";
import errorMiddleware from "./middleware/error.middleware";
import BackUpController from "./controllers/backup.controller";

class App {
  public app: express.Application;
  public port: number;
  private authController: AuthController;
  private backupController: BackUpController;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.authController = new AuthController();
    this.backupController = new BackUpController();
    this.initializeMiddlewares();
    this.initializeControllers([this.authController, this.backupController]);
    this.initializeErrorHandlers();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeErrorHandlers() {
    this.app.use(errorMiddleware);
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
