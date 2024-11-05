import type { Request, Response } from 'express';
import service from './service';
import type { LinkCreateSchema, LinkUpdateSchema } from './schema';
import type { ApiResponse, JWT_Payload } from '../schema';

async function create(
  req: Request<
    Record<string, any>,
    Record<string, any>,
    LinkCreateSchema & { userId: number }
  >,
  res: Response<ApiResponse<any>, { user: JWT_Payload }>,
) {
  const result = await service.createLink(
    { link: req.body.link, title: req.body.title },
    res.locals.user.id,
  );
  if (result.status === 'fail') {
    return res.status(result.error.code).json(result);
  }
  return res.status(201).json(result);
}

export default { create };
