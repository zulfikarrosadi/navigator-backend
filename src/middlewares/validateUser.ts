import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { JWT_Payload } from '../schema';

const JWT_SECRET = process.env.JWT_SECRET as string;

async function validateUser(
  req: Request,
  res: Response<Record<string, any>, {user: JWT_Payload}>,
  next: NextFunction,
) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({
      status: 'fail',
      error: {
        code: 403,
        message: 'make sure you use correct username and key',
      },
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWT_Payload;

    res.locals.user = decoded;
    next()
  } catch (error) {
    return res.status(403).json({
      status: 'fail',
      error: {
        code: 403,
        message: 'make sure you use correct username and key',
      },
    });
  }
}

export default validateUser