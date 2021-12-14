import { environment } from "../execution-env";
import { defaultStyler } from "./default-styler-functions";
import { AvailableLogLevels, Logger, LoggingLevels, Styling, StylingFunction } from "./types";

export function createLogger (styleFunctions : Styling = {}) : Logger {
  const logger = {};
  const namedLevels = Object.keys(LoggingLevels)
    .filter(key => !isNaN(Number(LoggingLevels[key]))) as AvailableLogLevels[];

  for(const level of namedLevels) {
    const style : StylingFunction = styleFunctions[level] ?? styleFunctions.default ?? defaultStyler;

    logger[level] = (...data : unknown[]) : void => {
      if(environment.constants.logLevel <= LoggingLevels[level]) return;

      process.stdout.write(style(level, new Date(), data) + "\n");
    };
  }
  return logger as Logger;
};

export const logger = createLogger();
