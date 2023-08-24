import { Folder } from "../models/folder.entity";
import { File } from "../models/file.entity";
import { Repository } from "typeorm";
import CloudStorageService from "./cloud.service";
import FileResponeDTO from "../DTO/fileResponse.dto";

class BackUpService {
  private fileRepository: Repository<File>;
  private folderRepository: Repository<Folder>;
  private cloudStorageService: CloudStorageService;

  constructor(
    fileRepository: Repository<File>,
    folderRepository: Repository<Folder>,
    cloudStorageService: CloudStorageService
  ) {
    (this.fileRepository = fileRepository),
      (this.folderRepository = folderRepository);
    this.cloudStorageService = cloudStorageService;
  }

  public async uploadFile(request: any) {
    const file = request.file;
    const user = request.user;
    const { originalname, mimetype, size } = file;
    const filename = await this.cloudStorageService.upload(file);
    const newFile = new File();
    newFile.name = originalname;
    newFile.mime_type = mimetype;
    newFile.size = size;
    newFile.user = user;
    newFile.filename = filename;
    const uploadedFile = await this.fileRepository.save(newFile);
    return new FileResponeDTO(uploadedFile);
  }

  public async createFolder(request: any) {
    const user = request.user;
    const { name } = request.body;
    const newFolder = new Folder();
    newFolder.name = name;
    newFolder.user = user;
    const folder = await this.folderRepository.save(newFolder);
    return folder;
  }

  public async getFiles(request: any) {
    const userId = request.user.userId;
    const userFolders = await this.folderRepository.find({
      where: { user: userId },
    });
    const files = await this.fileRepository.find({
      where: { user: userId, folder: false },
    });
    const mappedFiles = files.map((file) => new FileResponeDTO(file));
    return {
      folders: userFolders,
      files: mappedFiles,
    };
  }
}
export default BackUpService;
