import { Folder } from "../models/folder.entity";
import { File } from "../models/file.entity";
import { In, IsNull, Repository } from "typeorm";
import CloudStorageService from "./cloud.service";
import FileResponeDTO from "../DTO/fileResponse.dto";
import HttpException from "../exception/http.exception";
import FolderResponseDTO from "../DTO/folderResponse.dto";

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
    if (!file) {
      throw new HttpException(400, "No file uploaded");
    }
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
    if (!name) throw new HttpException(400, "No folder name provided");
    const newFolder = new Folder();
    newFolder.name = name;
    newFolder.user = user;
    const folder = await this.folderRepository.save(newFolder);
    return new FolderResponseDTO(folder);
  }

  public async getFiles(request: any) {
    const userId = request.user.id;
    const userFolders = await this.folderRepository.find({
      where: { user: userId },
    });
    const files = await this.fileRepository.find({
      where: { user: userId, folder: IsNull() },
    });
    const mappedFiles = files.map((file) => new FileResponeDTO(file));
    return {
      folders: userFolders,
      files: mappedFiles,
    };
  }

  public async moveFiles(request: any) {
    const userId = request.user.id;
    const fileIds = request.body.fileIds;
    const folderId = request.body.folderId;
    if (!fileIds.length || !folderId)
      throw new HttpException(400, "Provide folder and file ids");
    const folder = await this.folderRepository.findOne({
      where: { id: folderId, user: userId },
    });
    if (!folder) {
      throw new HttpException(404, "Folder does not exist");
    }
    await this.fileRepository.update(
      {
        user: userId,
        id: In(fileIds),
      },
      { folder: folder }
    );
    return {
      message: "Successful",
    };
  }

  public async downloadFile(request: any){
    const userId = request.user.id;
    const fileId = request.params.id
    if(!fileId) throw new HttpException(400, "provide file ID")
    const file = await this.fileRepository.findOne({where: {user: userId, id: fileId}})
    if(!file) throw new HttpException(404, "File does not exist")
    const fileBuffer = await this.cloudStorageService.download(file.filename)
    return {
        filename: file.name,
        mimetype: file.mime_type,
        file: fileBuffer
    }
  }
}
export default BackUpService;
