import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import service from './service';
import type { UserCreateSchema } from './schema';

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Create user
 */
async function create(
  req: Request<Record<string, any>, Record<string, any>, UserCreateSchema>,
  res: Response,
) {
  const result = await service.createUser(req.body);
  if (result.status === 'fail') {
    return res.status(result.error.code).json(result);
  }
  const token = jwt.sign(result.data.users, JWT_SECRET, { expiresIn: '3d' });

  return res
    .status(201)
    .cookie('token', token, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    })
    .json(result);
}

async function login(
  req: Request<Record<string, any>, Record<string, any>, UserCreateSchema>,
  res: Response,
) {
  const result = await service.login(req.body);
  if (result.status === 'fail') {
    return res.status(400).json(result);
  }
  const token = jwt.sign(result.data.users, JWT_SECRET, { expiresIn: '2d' });
  return res
    .status(200)
    .cookie('token', token, { sameSite: 'none', secure: true, httpOnly: true })
    .json(result);
}

export default {
  create,
  login
};
