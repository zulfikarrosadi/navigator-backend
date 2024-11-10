import { AsyncLocalStorage } from "node:async_hooks";
import { LoggerContext } from "./logger";

export const asyncLocalStorage = new AsyncLocalStorage<LoggerContext>();

export function getContext() {
  return asyncLocalStorage.getStore();
}
