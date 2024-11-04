import type { Request, Response } from 'express';
import service from './service';
import type { UserCreateSchema } from './schema';

async function create(
  req: Request<Record<string, any>, Record<string, any>, UserCreateSchema>,
  res: Response,
) {
  const result = await service.createUser(req.body);
  if (result.status === 'fail') {
    return res.status(result.error.code).json(result);
  }

  return res.status(201).json(result);
}

export default {
  create,
};
