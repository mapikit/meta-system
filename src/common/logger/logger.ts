import constants from "../constants.js";
import { defaultStyleFunctions } from "./default-styler-functions.js";
import { LogLevelsType, LoggerType, LogLevels, logLevelsArray, Styles, StylingFunction } from "./logger-types.js";

export class LoggerClass {
  constructor () {
    this.initialize(constants.DEFAULT_LOG_LEVEL)
      .catch(console.error);
  }

  public async initialize (logLevel : LogLevelsType, styles ?: Styles) : Promise<this> {
    const _styles = styles === undefined ? await defaultStyleFunctions : styles;
    for(const level of logLevelsArray) {
      const style : StylingFunction = _styles[level] ?? _styles.default ?? String;

      const env = (typeof process === "object") ? "node" : "browser";
      const writeFunction = env === "browser" ? this[level] : process.stdout.write;
      // In browser, use default console.log/warn/error

      const inLogRange = LogLevels[logLevel] >= LogLevels[level];
      this[level] = inLogRange ?
        (...data : unknown[]) : void => { writeFunction(style(data)); } :
        () : void => { /* EMPTY LOG FUNCTION */ };
    }

    return this;
  };

  fatal = console.error;
  success = console.log;
  operation = console.info;
  error = console.error;
  warn = console.warn;
  info = console.info;
  debug = console.debug;
}

export const logger = new LoggerClass() as unknown as (LoggerType & LoggerClass);
