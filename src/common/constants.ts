import { nanoid } from "nanoid";
import { LogLevelsType } from "./logger/logger-types.js";

export default Object.freeze({
  ENGINE_TTL: 2000,
  DEFAULT_LOG_LEVEL: "error" as LogLevelsType,
  ENGINE_OWNER: Symbol("Engine"),
  PERMISSION_OVERRIDE_VALUE: nanoid(),
});
