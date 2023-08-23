import connection from "../../config/database";
import express from "express";
import { File } from "../models/file.entity";
import { Folder } from "../models/folder.entity";
import multer from "multer";
import BackUpService from "../services/backup.service";

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
    this.router.post(
      `${this.path}/upload`,
      this.upload.single("file"),
      this.uploadFile
    );
    this.router.get(`${this.path}/download`, this.downloadFile);
  }

  private uploadFile = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    console.log(request.file);
    const file = await this.backupService.uploadFile()
  };

  private downloadFile = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {};
}
export default BackUpController;
