import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ServerError, UserAlreadyExistError } from "../error";
import type { UserCreateSchema } from "./schema";

const prisma = new PrismaClient()

const UNIQUE_CONSTRAINT_VIOLATION_CODE = 'P2002'

async function createUser(data: UserCreateSchema) {
  try {
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        key: data.key || null,
      },
      select: {
        id: true,
        username: true,
      }
    })
    return newUser
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('primsa unique constraint error: ', error)
      if (error.code === UNIQUE_CONSTRAINT_VIOLATION_CODE) {
        throw new UserAlreadyExistError('this username already exist')
      }
    }
    console.error('create user repo error: ', error)
    throw new ServerError('fail to create user, please try again later')
  }
}

export default {
  createUser
}