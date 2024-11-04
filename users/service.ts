import userRepository from './repository';
import type { ApiResponse } from '../schema';
import type { UserCreateSchema } from './schema';

async function createUser(
  data: UserCreateSchema,
): Promise<ApiResponse<{ id: number; username: string }>> {
  try {
    const newUser = await userRepository.createUser(data);

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

export default {
  createUser,
};
