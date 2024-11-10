import pino from "pino";
import "dotenv/config";

const pinoConfig = pino({
  level: process.env.PINO_LOG_LEVEL || "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

type Layer = "service" | "repository" | "handler";
export type LoggerContext = {
  requestId: string;
  operationId?: string;
  userId?: number;
};
type Level = "warn" | "error" | "info";

function logger(
  level: Level,
  layer: Layer,
  message: string,
  context?: LoggerContext,
) {
  return pinoConfig[level]({ layer, message, context });
}

export function logWithContext(
  level: Level,
  layer: Layer,
  message: string,
  operationId: string,
  context?: LoggerContext,
) {
  if (context) {
    logger(level, layer, message, {
      requestId: context.requestId,
      operationId: operationId,
      userId: context?.userId,
    });
  } else {
    logger("error", "handler", "refresh token cookie is empty");
  }
}

export default logger;
