import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthError, ServerError, UserAlreadyExistError } from "../error";
import type { UserCreateSchema } from "./schema";
import logger from "../logger";

const prisma = new PrismaClient();

const UNIQUE_CONSTRAINT_VIOLATION_CODE = "P2002";
const RELATED_RECORD_NOT_EXIST = "P2025";

async function createUser(data: UserCreateSchema) {
  try {
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        key: data.key,
      },
      select: {
        id: true,
        username: true,
      },
    });
    return newUser;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error(error.message);
      if (error.code === UNIQUE_CONSTRAINT_VIOLATION_CODE) {
        throw new UserAlreadyExistError("this username already exist");
      }
    }
    logger.error(error);
    throw new ServerError(
      "fail to register your account, please try again later",
    );
  }
}

async function getUserByUsername(username: string) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username: username },
      select: { id: true, username: true, key: true },
    });

    return user;
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      logger.error(error.message);
      if (error.code === RELATED_RECORD_NOT_EXIST) {
        throw new AuthError();
      }
    }
    logger.error(error);
    throw new ServerError(
      "fail to login, this is not your fault, please try again later",
    );
  }
}

export default {
  createUser,
  getUserByUsername,
};
