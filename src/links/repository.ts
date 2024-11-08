import { PrismaClient } from '@prisma/client';
import type { LinkCreateSchema, LinkUpdateSchema } from './schema';
import { BadRequest, NotFoundError, ServerError } from '../error';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

const RELATED_RECORD_NOT_EXIST = 'P2025';

async function createLink(data: LinkCreateSchema, userId: number) {
  try {
    const newLink = await prisma.link.create({
      data: {
        title: data.title,
        link: data.link,
        User: { connect: { id: userId } },
      },
      select: {
        id: true,
        title: true,
        link: true,
      },
    });

    return newLink;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('create link prisma error: ', error);
      if (error.code === RELATED_RECORD_NOT_EXIST) {
        throw new BadRequest(
          'fail to add new link, make sure you are using correct user account and try again',
        );
      }
    }
    console.error('create link repository error: ', error);
    throw new ServerError('fail to add new link, please try again later');
  }
}

async function updateLink(
  data: LinkUpdateSchema,
  linkId: number,
  userId: number,
) {
  try {
    const updatedLink = await prisma.link.update({
      where: {
        id: linkId,
        AND: {
          User: {
            id: userId,
          },
        },
      },
      data: {
        title: data.title,
        link: data.link,
      },
      select: {
        title: true,
        link: true,
      },
    });
    return updatedLink;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === RELATED_RECORD_NOT_EXIST) {
        throw new NotFoundError('update link fail, link is not found');
      }
    }
    throw new BadRequest('update link fail, please try again');
  }
}

async function deleteLink(id: number, userId: number) {
  try {
    await prisma.link.delete({
      where: {
        id: id,
        AND: {
          User: {
            id: userId,
          },
        },
      },
    });
    return true;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('delete link repo prisma error: ', error);

      if (error.code === RELATED_RECORD_NOT_EXIST) {
        throw new NotFoundError('delete link fail, link is not found');
      }
    }
    console.error('delete link repo error: ', error);
    throw new BadRequest('delete link fail, please try again');
  }
}

async function getLinks(
  username: string,
): Promise<{ id: number; title: string; link: string }[] | [] | ServerError> {
  try {
    const links = await prisma.link.findMany({
      where: {
        User: {
          username: username,
        },
      },
      take: 50,
      select: {
        id: true,
        title: true,
        link: true,
      },
    });
    return links;
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      console.log('prisma connection timeout error: ', error);
    }
    throw new ServerError(
      'fail to retrieve your requested links, please try again later',
    );
  }
}

async function getLinkById(username: string, id: number) {
  try {
    const link = await prisma.link.findUniqueOrThrow({
      where: { id: id, AND: { User: { username: username } } }
    });
    return link
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === RELATED_RECORD_NOT_EXIST) {
        throw new NotFoundError("link is not found")
      }
    }
    console.log("get link by id error: ", error)
    throw new BadRequest("fail to retrive your requested links, please try again later")
  }
}

export default {
  getLinkById,
  createLink,
  updateLink,
  deleteLink,
  getLinks,
};
