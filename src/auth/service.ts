import bcrypt from "bcrypt";
import { AuthError } from "../error";
import type { ApiResponse } from "../schema";
import userRepository from "./repository";
import type { UserCreateSchema } from "./schema";
import logger from "../logger";

const DEFAULT_BUN_HASH_COST = 4;
type User = {
  id: number;
  username: string;
};

async function createUser(data: UserCreateSchema): Promise<ApiResponse<User>> {
  try {
    const hashedKey = bcrypt.hashSync(data.key, DEFAULT_BUN_HASH_COST);
    const newUser = await userRepository.createUser({
      ...data,
      key: hashedKey,
    });

    return {
      status: "success",
      data: {
        users: {
          id: newUser.id,
          username: newUser.username,
        },
      },
    };
  } catch (error: any) {
    logger.error(error.message || error);
    return {
      status: "fail",
      error: {
        code: error.code,
        message: error.message || error,
      },
    };
  }
}

async function login(data: UserCreateSchema): Promise<ApiResponse<User>> {
  try {
    const user = await userRepository.getUserByUsername(data.username);
    if (!user) {
      throw new AuthError();
    }
    const isPasswordCorrect = bcrypt.compareSync(data.key, user.key);
    if (!isPasswordCorrect) {
      throw new AuthError();
    }
    return {
      status: "success",
      data: {
        users: {
          id: user.id,
          username: user.username,
        },
      },
    };
  } catch (error: any) {
    return {
      status: "fail",
      error: {
        code: error.code,
        message: error.message || error,
      },
    };
  }
}

export default {
  createUser,
  login,
};
