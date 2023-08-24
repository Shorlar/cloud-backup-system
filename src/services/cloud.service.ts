import { Storage } from "@google-cloud/storage";
import path from "path";
import HttpException from "../exception/http.exception";

class CloudStorageService {
  private cloudStorage: Storage;

  constructor() {
    this.cloudStorage = new Storage({
      projectId: "predictive-host-396816",
      keyFilename: path.join(
        __dirname,
        "../../predictive-host-396816-d7deb3b098d5.json"
      ),
    });
  }

  public async upload(file: any): Promise<string> {
    const filename = `${file.originalname}${new Date().getTime()}`;
    const bucket = await this.cloudStorage.bucket("mybackupsys");
    const upload = bucket.file(filename);
    const stream = upload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    stream.on("error", (err) => {
      console.error(err);
      throw new HttpException(500, "Error uploading file");
    });
    stream.end(file.buffer);
    return filename;
  }

  public async download(filename: string){
    const bucket = await this.cloudStorage.bucket("mybackupsys");
    const file = bucket.file(filename)
    const fileBuffer = await file.download()
    return fileBuffer
  }
}
export default CloudStorageService;
