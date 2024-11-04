import { type LinkCreateSchema } from './schema';
import repository from './repository';
import type { ApiResponse } from '../schema';

async function createLink(
  data: LinkCreateSchema,
  userId: number,
): Promise<ApiResponse<{ title: string; link: string; id: number }>> {
  try {
    const newLink = await repository.createLink(data, userId);

    return { status: 'success', data: { links: newLink } };
  } catch (error: any) {
    console.error('create link service error: ', error);

    return {
      status: 'fail',
      error: {
        code: error.code,
        message: error.message || error,
      },
    };
  }
}

export default { createLink };
