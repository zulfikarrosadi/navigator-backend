import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthError, ServerError, UserAlreadyExistError } from "../error";
import type { UserCreateSchema } from "./schema";
import { getContext } from "../asyncLocalStorage";
import { logWithContext } from "../logger";

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
  } catch (error: any) {
    const context = getContext();
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === UNIQUE_CONSTRAINT_VIOLATION_CODE) {
        logWithContext(
          "error",
          "repository",
          "username already exist",
          "createUser",
          context,
        );
        throw new UserAlreadyExistError("this username already exist");
      }
    }
    logWithContext(
      "error",
      "repository",
      error.message || error,
      "createUser",
      context,
    );
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
    const context = getContext();
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === RELATED_RECORD_NOT_EXIST) {
        logWithContext(
          "error",
          "repository",
          "username not found",
          "getUserByUsername",
          context,
        );
        throw new AuthError();
      }
    }
    logWithContext(
      "error",
      "repository",
      error.message || error,
      "getUserByUsername",
      context,
    );
    throw new ServerError(
      "fail to login, this is not your fault, please try again later",
    );
  }
}

export default {
  createUser,
  getUserByUsername,
};
