import HttpException from "../exception/http.exception";
import * as bcrypt from "bcrypt";
import UserService from "./user.service";
import JwtService from "./jwt.services";
import { Repository } from "typeorm";
import { User } from "../models/user.entity";

jest.mock("typeorm");

const jwtService = {
  generateToken: jest.fn().mockReturnValue("eytry56893ijwiehuhdsyuy8"),
  verifyToken: jest.fn(),
} as unknown as JwtService;

let mockRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
} as unknown as Repository<User>;

let userService: UserService;

describe("userService", () => {
  beforeAll(() => {
    userService = new UserService(jwtService, mockRepository);
  });

  afterAll(() => jest.clearAllMocks());

  describe("createUser", () => {
    it("should create a user and return an access token", async () => {
      const userDetails = {
        email: "test@example.com",
        password: "password",
        fullName: "tope ade",
      };
      const result = await userService.createUser(userDetails);
      expect(result).toEqual({ token: "eytry56893ijwiehuhdsyuy8" });
    });

    it("should throw an error when missing email, password, or fullName", async () => {
      const userDetails = {
        email: "test@example.com",
        password: "",
        fullName: "tope ade",
      };
      await expect(userService.createUser(userDetails)).rejects.toThrow(
        new HttpException(400, "email, password or fullName is not provided")
      );
    });

    it("should throw catch database error", async () => {
      const userDetails = {
        email: "test@example.com",
        password: "password",
        fullName: "tope ade",
      };
      try {
        await expect(userService.createUser(userDetails))
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
      }
    });
  });

  describe("signIn", ()=> {
    it('should sign user in and return an access token', async () => {
        userService.getUser = jest.fn().mockResolvedValue({
          email: "test@example.com",
          password: await bcrypt.hash('password', 10),
        });
        const signInDetails = {
          email: 'test@example.com',
          password: 'password',
        };
        const result = await userService.signIn(signInDetails);
        expect(result).toEqual({ token: 'eytry56893ijwiehuhdsyuy8' });
      });

      it('should throw an error if user does not exist', async () => {
        userService.getUser = jest.fn().mockResolvedValue(null);
        const signInDetails = {
          email: 'test@example.com',
          password: 'password', 
        };
        await expect(userService.signIn(signInDetails)).rejects.toThrow(
          new HttpException(400, 'Invalid Credentials')
        );
      });
  })
});
