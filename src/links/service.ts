import { type LinkCreateSchema, type LinkUpdateSchema } from './schema';
import repository from './repository';
import type { ApiResponse } from '../schema';
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
        code: 404,
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

async function deleteLink(id: string, userId: number): Promise<ApiResponse<null>> {
  const parsedLinkId = parseInt(id, 10);
  if (Number.isNaN(parsedLinkId)) {
    return {
      status: 'fail',
      error: {
        code: 404,
        message: 'fail to delete link, link is not found',
      },
    };
  }
  try {
    await repository.deleteLink(parsedLinkId, userId);
    // @ts-ignore
    return {
      status: 'success',
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

async function getLinks(
  username: string,
): Promise<ApiResponse<[] | { id: number; title: string; link: string }[]>> {
  try {
    const links = await repository.getLinks(username);
    if (links instanceof ServerError) {
      throw links;
    }
    if (!links.length) {
      return {
        status: 'success',
        data: {
          links: [],
        },
      };
    }
    return {
      status: 'success',
      data: {
        links: links.map((link) => ({
          id: link.id,
          title: link.title,
          link: link.link,
        })),
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

async function getLinkById(username: string, id: string): Promise<ApiResponse<{ id: number, title: string, link: string }>> {
  const parsedId = parseInt(id, 10)
  if (Number.isNaN(parsedId)) {
    return {
      status: "fail",
      error: {
        code: 404,
        message: "link not found"
      }
    }
  }
  try {
    const link = await repository.getLinkById(username, parsedId)
    return {
      status: "success",
      data: {
        links: {
          id: link.id,
          title: link.title,
          link: link.link
        }
      }
    }
  } catch (error: any) {
    return {
      status: "fail",
      error: {
        message: error.message || error,
        code: error.code

      }
    }
  }
}

export default { createLink, updateLink, deleteLink, getLinks, getLinkById };
