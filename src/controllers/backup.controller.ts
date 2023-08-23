import connection from "../../config/database";
import express, { Request } from "express";
import { File } from "../models/file.entity";
import { Folder } from "../models/folder.entity";
import multer from "multer";
import BackUpService from "../services/backup.service";
import validateTokenMiddleware from "../middleware/validate-token.middleware";

class BackUpController {
  public path = "/backup";
  public router = express.Router();
  private backupService: BackUpService;
  private fileRepository = connection.getRepository(File);
  private folderRepository = connection.getRepository(Folder);
  private upload = multer();

  constructor() {
    this.backupService = new BackUpService(
      this.fileRepository,
      this.folderRepository
    );
    this.initializeRoutes();
  }

  private initializeRoutes() {
      this.router.post(`${this.path}/upload`, validateTokenMiddleware, this.upload.single("file"), this.uploadFile)
      this.router.get(`${this.path}/download`, validateTokenMiddleware,this.downloadFile);
  }

  private uploadFile = async (
    request: any,
    response: express.Response,
    next: express.NextFunction
  ) => {
    console.log(request.user)
    console.log(request.file);
    const file = await this.backupService.uploadFile();
  };

  private downloadFile = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {};
}
export default BackUpController;
