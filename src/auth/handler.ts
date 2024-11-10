import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JWT_Payload } from "../schema";
import type { UserCreateSchema } from "./schema";
import service from "./service";
import { getContext } from "../asyncLocalStorage";
import { logWithContext } from "../logger";

const JWT_SECRET = process.env.JWT_SECRET as string;
/**
 * 10 minutes in ms
 */
const ACCESS_TOKEN_EXPIRATION_TIME = 600_000;
/**
 * 10 days in ms
 */
const REFRESH_TOKEN_EXPIRATION_TIME = 864_000_000;

/**
 * Create user
 */
async function create(
  req: Request<Record<string, any>, Record<string, any>, UserCreateSchema>,
  res: Response,
) {
  const result = await service.createUser(req.body);
  if (result.status === "fail") {
    return res.status(result.error.code).json(result);
  }
  const accessToken = jwt.sign(result.data.users, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
  const refreshToken = jwt.sign(result.data.users, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return res
    .status(201)
    .cookie("token", accessToken, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    })
    .cookie("token", refreshToken, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      path: "/api/refresh",
    })
    .json(result);
}

async function login(
  req: Request<Record<string, any>, Record<string, any>, UserCreateSchema>,
  res: Response,
) {
  const result = await service.login(req.body);
  if (result.status === "fail") {
    return res.status(400).json(result);
  }

  const accessToken = jwt.sign(result.data.users, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
  const refreshToken = jwt.sign(result.data.users, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
    })
    .cookie("refreshToken", refreshToken, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
      path: "/api/refresh",
    })
    .json(result);
}

async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    const context = getContext();
    logWithContext(
      "error",
      "handler",
      "refresh token cookie is empty",
      "refresh",
      context,
    );
    res.status(401).json({
      status: "fail",
      error: {
        code: 401,
        message: "fail to update access token, refresh token is invalid",
      },
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as JWT_Payload;
    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      JWT_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
      },
    );
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        secure: true,
        sameSite: "none",
        maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
      })
      .json({
        status: "success",
        data: {
          users: {
            id: decoded.id,
            username: decoded.username,
          },
        },
      });
  } catch (error: any) {
    const context = getContext();
    logWithContext(
      "error",
      "handler",
      error.message || error,
      "refreshToken",
      context,
    );
    res.status(401).json({
      status: "fail",
      error: {
        code: 401,
        message: "fail to update access token, refresh token is invalid",
      },
    });
  }
}

export default {
  create,
  login,
  refresh,
};
