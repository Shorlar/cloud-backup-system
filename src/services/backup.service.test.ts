import { File } from "../models/file.entity";
import { Folder } from "../models/folder.entity";
import { Repository } from "typeorm";
import BackUpService from "./backup.service";
import CloudStorageService from "./cloud.service";
import FileResponeDTO from "../DTO/fileResponse.dto";
import HttpException from "../exception/http.exception";
import FolderResponseDTO from "../DTO/folderResponse.dto";
jest.mock("../models/file.entity");
jest.mock("../DTO/fileResponse.dto");
jest.mock("../models/file.entity");
jest.mock("typeorm");
jest.mock("../DTO/folderResponse.dto");

let mockFileRepository = {
  save: jest.fn().mockResolvedValue({
    id: 1,
    name: "filename",
    size: 200,
    mime_type: "image/jpeg",
    uploaded_at: new Date(),
  }),
  findOne: jest.fn().mockResolvedValue({
    id: 1,
    name: "filename",
    size: 200,
    mime_type: "image/jpeg",
    uploaded_at: new Date(),
  }),
  update: jest.fn().mockResolvedValue(true),
  find: jest.fn().mockResolvedValue([
    {
      id: 1,
      name: "filename",
      size: 200,
      mime_type: "image/jpeg",
      uploaded_at: new Date(),
    },
  ]),
} as unknown as Repository<File>;

let mockFolderRepository = {
  save: jest
    .fn()
    .mockResolvedValue({ id: 1, name: "foldername", created_date: new Date() }),
  findOne: jest
    .fn()
    .mockResolvedValue({ id: 1, name: "foldername", created_date: new Date() }),
  find: jest
    .fn()
    .mockResolvedValue([
      { id: 1, name: "foldername", created_date: new Date() },
    ]),
} as unknown as Repository<Folder>;

let mockCloudStorage = {
  upload: jest.fn(),
  download: jest.fn(),
} as unknown as CloudStorageService;

let request: any = {
  file: {
    originalname: "test.jpg",
    mimetype: "image/jpeg",
    buffer: Buffer.from("file contents"),
  },
  user: {
    email: "test@example.com",
    password: "password",
    fullName: "tope ade",
    id: 1,
  },
  body: {
    name: "filename",
    fileIds: [2, 3],
    folderId: 1,
  },
  params: {
    id: 1,
  },
};

let backUpService: BackUpService;

describe("back up service", () => {
  beforeAll(() => {
    backUpService = new BackUpService(
      mockFileRepository,
      mockFolderRepository,
      mockCloudStorage
    );
  });

  describe("upload file", () => {
    it("should upload file", async () => {
      const file = await backUpService.uploadFile(request);
      expect(mockCloudStorage.upload).toBeCalled();
      expect(mockFileRepository.save).toBeCalled();
      expect(file).toBeInstanceOf(FileResponeDTO);
    });

    it("should throw error if no file", async () => {
      request.file = undefined;
      try {
        await backUpService.uploadFile(request);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe("create folder", () => {
    it("should create folder", async () => {
      const folder = await backUpService.createFolder(request);
      expect(mockFolderRepository.save).toBeCalled;
      expect(folder).toBeInstanceOf(FolderResponseDTO);
    });
    it("should throw error if no folder name", async () => {
      request.body.name = undefined;
      try {
        await backUpService.createFolder(request);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe("get files", () => {
    it("should get files and folder", async () => {
      await backUpService.getFiles(request);
      expect(mockFileRepository.find).resolves;
      expect(mockFolderRepository.find).resolves;
      expect(mockFolderRepository.find).toBeCalled();
      expect(mockFileRepository.find).toBeCalled();
    });
  });

  describe("move files", () => {
    it("should move files to a folder", async () => {
      const response = await backUpService.moveFiles(request);
      expect(mockFolderRepository.findOne).resolves;
      expect(mockFileRepository.update).resolves;
      expect(mockFolderRepository.findOne).toBeCalled();
      expect(mockFileRepository.update).toBeCalled();
      expect(response).toEqual({ message: "Successful" });
    });

    it("should throw error if either file Ids or folder Id is missing", async () => {
      request.body.folderId = null;
      try {
        await backUpService.moveFiles(request);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it("should throw error if folder is not found", async () => {
      mockFolderRepository = {
        findOne: jest.fn().mockRejectedValue(true),
      } as unknown as Repository<Folder>;
      try {
        await backUpService.moveFiles(request);
        expect(mockFolderRepository.findOne).toBeCalled();
        expect(mockFolderRepository.findOne).rejects;
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe("Download file", () => {
    it("should download files", async () => {
      await backUpService.downloadFile(request);
      expect(mockFileRepository.findOne).resolves;
      expect(mockFileRepository.findOne).toBeCalled();
      expect(mockCloudStorage.download).toBeCalled();
    });

    it("should throw error if no file Id is provided", async () => {
      request.params.id = null;
      try {
        await backUpService.downloadFile(request);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it("should throw error if file is not found", async () => {
      mockFileRepository = {
        findOne: jest.fn().mockRejectedValue(true),
      } as unknown as Repository<File>;
      try {
        await backUpService.downloadFile(request);
        expect(mockFileRepository.findOne).rejects;
        expect(mockFolderRepository.findOne).toBeCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });
});
