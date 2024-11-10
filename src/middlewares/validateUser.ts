import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JWT_Payload } from "../schema";
import logger from "../logger";
import { getContext } from "../asyncLocalStorage";
import { randomUUID } from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET as string;

async function validateUser(
  req: Request,
  res: Response<Record<string, any>, { user: JWT_Payload }>,
  next: NextFunction,
) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    const context = getContext();
    logger("error", "handler", "access token cookie is empty", {
      requestId: context?.requestId ?? randomUUID(),
      operationId: "validateUser",
    });
    return res.status(403).json({
      status: "fail",
      error: {
        code: 403,
        message: "make sure you use correct username and key",
      },
    });
  }
  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as JWT_Payload;

    res.locals.user = decoded;
    next();
  } catch (error: any) {
    const context = getContext();
    logger("error", "handler", error.message || error, {
      requestId: context?.requestId ?? randomUUID(),
      operationId: "validateUser",
    });
    return res.status(403).json({
      status: "fail",
      error: {
        code: 403,
        message: "make sure you use correct username and key",
      },
    });
  }
}

export default validateUser;
