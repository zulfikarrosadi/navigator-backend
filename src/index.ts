import cookieParser from "cookie-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import swaggerUI from "swagger-ui-express";
import authHandler from "./auth/handler";
import { userCreateSchema } from "./auth/schema";
import linkHandler from "./links/handler";
import { linkUpdateSchema, linksCreateSchema } from "./links/schema";
import { validateInput } from "./middlewares/validateInput";
import validateUser from "./middlewares/validateUser";
import {
  generateRequestId,
  storeUserToContext,
} from "./middlewares/asyncLocalStorage";
import logger from "./logger";
import swaggerDocument from "./../openapi.json";

const app = express();
configDotenv();

const SWAGGER_CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: getAllowedOrigin(),
  }),
);
app.use(
  "/api/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, {
    customCssUrl: SWAGGER_CSS_URL,
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
  }),
);
app.use(generateRequestId);
app.post("/api/signup", validateInput(userCreateSchema), authHandler.create);
app.post("/api/signin", validateInput(userCreateSchema), authHandler.login);
app.get("/api/refresh", authHandler.refresh);
app.get("/api/links/:username", linkHandler.index);
app.use(validateUser);
app.use(storeUserToContext);
app.post("/api/links", validateInput(linksCreateSchema), linkHandler.create);
app.put("/api/links/:id", validateInput(linkUpdateSchema), linkHandler.update);
app.delete("/api/links/:id", linkHandler.destroy);
app.get("/api/links/:username/:id", linkHandler.show);

app.listen(process.env.PORT, () =>
  logger("info", "handler", `server is running on port ${process.env.PORT}`),
);

function getAllowedOrigin() {
  if (process.env.NODE_ENV !== "development") {
    return [process.env.CLIENT_HOST] as string[];
  }

  const allowedOriginRaw = process.env.ALLOWED_ORIGIN as string;
  if (!allowedOriginRaw) {
    return [process.env.CLIENT_HOST] as string[];
  }

  return allowedOriginRaw.split(",").map((origin) => origin);
}

export default app;
