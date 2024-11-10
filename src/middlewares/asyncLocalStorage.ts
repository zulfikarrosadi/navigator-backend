import type { NextFunction, Request, Response } from "express";
import { LoggerContext } from "../logger";
import { randomUUID } from "node:crypto";
import { asyncLocalStorage } from "../asyncLocalStorage";

/**
 * This function will generate unique requestId and store it to asyncLocalStoragre
 * and because of asyncLocalStorage, the requestId can be accessed throughout promise chain
 */
function generateRequestId(_req: Request, _res: Response, next: NextFunction) {
  const context: LoggerContext = {
    requestId: randomUUID(),
  };
  asyncLocalStorage.run(context, () => {
    next();
  });
}

/**
 * This function will add userId to the asyncLocalStorage context
 */
function storeUserToContext(
  _req: Request,
  res: Response<Record<string, any>, { user: { id: number } }>,
  next: NextFunction,
) {
  const context = asyncLocalStorage.getStore();
  asyncLocalStorage.run(
    {
      requestId: context?.requestId ?? randomUUID(),
      userId: res.locals.user.id,
    },
    () => {
      next();
    },
  );
}

export { generateRequestId, storeUserToContext };
