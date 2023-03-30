import { LogLevelsType } from "./logger/logger-types.js";

export default Object.freeze({
  JWT_KEY: "tempKey",
  ARRAY_INDICATOR: "[$source]",
  ENGINE_TTL: 2000,
  MONGO: {
    URL: "mongodb://localhost:27017",
    USER: "api-development",
    PASS: "apipass",
  },
  CLIENT_DB_DIGITS: 8,
  DEFAULT_LOG_LEVEL: "error" as LogLevelsType,
});
