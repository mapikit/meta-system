import { nanoid } from "nanoid";
import { LogLevelsType } from "./logger/logger-types.js";

const runtimeEngineIdentifier = nanoid();

export default Object.freeze({
  ENGINE_TTL: 2000,
  DEFAULT_LOG_LEVEL: "error" as LogLevelsType,
  ENGINE_OWNER: Symbol(runtimeEngineIdentifier),
  RUNTIME_ENGINE_IDENTIFIER: runtimeEngineIdentifier,
  PERMISSION_OVERRIDE_VALUE: nanoid(),
});
