import { Folder } from "../models/folder.entity";

export default class FolderResponseDTO {
  private id: number;
  private name: string;
  private createdAt: Date;

  constructor(folder: Folder) {
    this.id = folder.id;
    this.name = folder.name;
    this.createdAt = folder.created_date;
  }
}
