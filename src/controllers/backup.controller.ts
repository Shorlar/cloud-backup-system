import connection from "../../config/database";
import express from "express";
import { File } from "../models/file.entity";
import { Folder } from "../models/folder.entity";
import multer from "multer";
import BackUpService from "../services/backup.service";
import validateTokenMiddleware from "../middleware/validate-token.middleware";
import CloudStorageService from "../services/cloud.service";

class BackUpController {
  public path = "/backup";
  public router = express.Router();
  private backupService: BackUpService;
  private fileRepository = connection.getRepository(File);
  private folderRepository = connection.getRepository(Folder);
  private upload: multer.Multer;
  private cloudStorageService: CloudStorageService;

  constructor() {
    this.upload = multer({ limits: { fileSize: 200 * 1024 * 1024 } });
    this.cloudStorageService = new CloudStorageService();
    this.backupService = new BackUpService(
      this.fileRepository,
      this.folderRepository,
      this.cloudStorageService
    );
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/upload`,
      validateTokenMiddleware,
      this.upload.single("file"),
      this.uploadFile
    );
    this.router.get(
      `${this.path}/download`,
      validateTokenMiddleware,
      this.downloadFile
    );
    this.router.get(
      `${this.path}/files`,
      validateTokenMiddleware,
      this.getFiles
    );
    this.router.post(
      `${this.path}/folder`,
      validateTokenMiddleware,
      this.createFolder
    );
  }

  private uploadFile = async (
    request: any,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const file = await this.backupService.uploadFile(request);
      response.send(file);
    } catch (error) {
      next(error);
    }
  };

  private createFolder = async (
    request: any,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const folder = await this.backupService.createFolder(request);
      response.send(folder);
    } catch (error) {
      next(error);
    }
  };

  private getFiles = async (
    request: any,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const folder = await this.backupService.getFiles(request);
      response.send(folder);
    } catch (error) {
      next(error);
    }
  };

  private downloadFile = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {};
}
export default BackUpController;
