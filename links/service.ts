import { type LinkCreateSchema, type LinkUpdateSchema } from './schema';
import repository from './repository';
import type { ApiResponse } from '../schema';
import { Prisma, type Link } from '@prisma/client';
import { ServerError } from '../error';

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

async function updateLink(
  data: LinkUpdateSchema,
  linkId: string,
  userId: number,
): Promise<ApiResponse<LinkUpdateSchema & { id: number }>> {
  const parsedLinkId = parseInt(linkId);
  if (Number.isNaN(parsedLinkId)) {
    return {
      status: 'fail',
      error: {
        code: 400,
        message: 'fail to update link, link id not found',
      },
    };
  }

  try {
    const updatedLink = await repository.updateLink(data, parsedLinkId, userId);
    return {
      status: 'success',
      data: {
        links: {
          id: parsedLinkId,
          title: updatedLink.title,
          link: updatedLink.link,
        },
      },
    };
  } catch (error: any) {
    return {
      status: 'fail',
      error: {
        code: error.code,
        message: error.message || error,
      },
    };
  }
}
export default { createLink, updateLink, deleteLink, getLinks };
