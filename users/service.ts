import userRepository from './repository';
import type { ApiResponse } from '../schema';
import type { UserCreateSchema } from './schema';
import { AuthError } from '../error';

const DEFAULT_BUN_HASH_COST = 4;

async function createUser(
  data: UserCreateSchema,
): Promise<ApiResponse<{ id: number; username: string }>> {
  try {
    const hashedKey = Bun.password.hashSync(data.key, {
      algorithm: 'bcrypt',
      cost: DEFAULT_BUN_HASH_COST,
    });
    const newUser = await userRepository.createUser({
      ...data,
      key: hashedKey,
    });

    return {
      status: 'success',
      data: {
        users: {
          id: newUser.id,
          username: newUser.username,
        },
      },
    };
  } catch (error: any) {
    console.error('create user service error: ', error);

    return {
      status: 'fail',
      error: {
        code: error.code,
        message: error.message || error,
      },
    };
  }
}

async function login(
  data: UserCreateSchema,
): Promise<ApiResponse<{ id: number; username: string }>> {
  try {
    const user = await userRepository.getUserByUsername(data.username);
    if (!user) {
      throw new AuthError();
    }
    const isPasswordCorrect = Bun.password.verifySync(data.key, user.key);
    if (!isPasswordCorrect) {
      throw new AuthError();
    }
    return {
      status: 'success',
      data: {
        users: {
          id: user.id,
          username: user.username,
        },
      },
    };
  } catch (error: any) {
    return {
      status: 'fail',
      error: {
        code: error.code,
        message: error.message || error
      }
    };
  }
}

export default {
  createUser,
  login
};
