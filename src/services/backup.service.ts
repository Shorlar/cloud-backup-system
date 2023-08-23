import { Folder } from "../models/folder.entity";
import { File } from "../models/file.entity";
import { Repository } from "typeorm";

class BackUpService {
  private fileRepository: Repository<File>;
  private folderRepository: Repository<Folder>;

  constructor(
    fileRepository: Repository<File>,
    folderRepository: Repository<Folder>
  ) {
    (this.fileRepository = fileRepository),
      (this.folderRepository = folderRepository);
  }

  public async uploadFile(){

  }
}

export default BackUpService;
