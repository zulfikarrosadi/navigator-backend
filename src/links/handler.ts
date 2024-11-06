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

async function update(
  req: Request<{ id: string }, Record<string, any>, LinkUpdateSchema>,
  res: Response<ApiResponse<any>, { user: JWT_Payload }>,
) {
  const result = await service.updateLink(
    req.body,
    req.params.id,
    res.locals.user.id,
  );
  if (result.status === 'fail') {
    return res.status(result.error.code).json(result);
  }
  return res.status(200).json(result);
}

async function destroy(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<any>, { user: JWT_Payload }>,
) {
  const result = await service.deleteLink(req.params.id);
  if (result.status === 'fail') {
    return res.status(result.error.code).json(result);
  }
  return res.sendStatus(204);
}

async function index(req: Request<{ username: string }>, res: Response) {
  const result = await service.getLinks(req.params.username);
  if (result.status === 'fail') {
    return res.status(result.error.code).json(result);
  }
  return res.status(200).json(result);
}

export default { create, update, destroy, index };
