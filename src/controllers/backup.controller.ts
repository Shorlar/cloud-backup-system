import connection from "../../config/database";
import express from "express";
import { File } from "../models/file.entity";
import { Folder } from "../models/folder.entity";

class BackUpController {
  public path = "/backup";
  public router = express.Router();
  private fileRepository = connection.getRepository(File);
  private folderRepository = connection.getRepository(Folder);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload`, this.uploadFile);
    this.router.get(`${this.path}/download`, this.downloadFile);
  }

  private uploadFile = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {};

  private downloadFile = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {};
}
export default BackUpController;
