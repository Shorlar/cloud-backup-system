import { NextFunction, Response } from "express";
import HttpException from "../exception/http.exception";
import JwtService from "../services/jwt.services";
import { TokenType } from "../types/token.type";
import connection from "../../config/database";
import { User } from "../models/user.entity";

async function validateTokenMiddleware(
  request: any,
  response: Response,
  next: NextFunction
) {
  const jwtService = new JwtService();
  const repository = connection.getRepository(User);
  const { authorization } = request.headers;
  if (authorization) {
    const auth = authorization.split(" ");
    if (auth[0] === "Bearer")
      new HttpException(400, "Invalid or missing token");
    const token = auth[1];
    const jwtPayload = jwtService.verifyToken(token) as TokenType;
    const userEmail = jwtPayload.email;
    const user = await repository.findOne({ where: { email: userEmail } });
    request.user = user;
    next()
  } else {
    next(new HttpException(400, "Invalid or missing token"));
  }
}

export default validateTokenMiddleware;
