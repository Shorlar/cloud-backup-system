import { File } from "../models/file.entity";

export default class FileResponeDTO {
  private id: number;
  private name: string;
  private size: number;
  private mimetype: string;
  private uploadedAt: Date;

  constructor(file: File) {
    this.id = file.id;
    this.name = file.name;
    this.size = file.size;
    this.mimetype = file.mime_type;
    this.uploadedAt = file.uploaded_at;
  }
}
