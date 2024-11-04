import { PrismaClient } from '@prisma/client';
import type { LinkCreateSchema } from './schema';
import { BadRequest, ServerError } from '../error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

const FOREIGN_KEY_LINK_TO_USER_ERROR = 'P2025';

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
      if (error.code === FOREIGN_KEY_LINK_TO_USER_ERROR) {
        throw new BadRequest(
          'fail to add new link, make sure you are using correct user account and try again',
        );
      }
    }
    console.error('create link repository error: ', error);
    throw new ServerError('fail to add new link, please try again later');
  }
}

export default {
  createLink,
};
