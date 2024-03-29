import constants from "../constants.js";
import { getDefaultStyleFunctions } from "./default-styler-functions.js";
import { LogLevelsType, LoggerType, LogLevels, logLevelsArray, Styles, StylingFunction } from "./logger-types.js";

export class LoggerClass implements LoggerType {
  constructor () {
    this.initializeDefault(constants.DEFAULT_LOG_LEVEL);
  }

  private initializeDefault (logLevel : LogLevelsType) : void {
    for(const level of logLevelsArray) {
      const inLogRange = LogLevels[logLevel] >= LogLevels[level];
      if(!inLogRange) this[level] = () : void => undefined;
    }
  }

  public async initialize (logLevel : LogLevelsType, styles ?: Styles) : Promise<this> {
    const _styles = styles ?? (await getDefaultStyleFunctions());

    for(const level of logLevelsArray) {
      const style : StylingFunction = _styles[level] ?? _styles.default ?? String;

      const env = (typeof process === "object") ? "node" : "browser";

      const writeFunction = (env === "browser") ?
        this.getBrowserLog(level) :
        ((log : string) : boolean => process.stdout.write(log));

      const inLogRange = LogLevels[logLevel] >= LogLevels[level];
      this[level] = inLogRange ?
        (...data : unknown[]) : void => { writeFunction(style(data)); } :
        () : void => { /* EMPTY LOG FUNCTION */ };
    }

    return this;
  };


  private getBrowserLog (level : LogLevelsType) : Function {
    if(console[level] !== undefined) return console[level];
    switch (level) {
      case "fatal": return console.error;
      case "operation": return console.info;
      default: return console.log;
    }
  }

  fatal = console.error;
  success = console.log;
  operation = console.info;
  error = console.error;
  warn = console.warn;
  info = console.info;
  debug = console.debug;
}

export const logger = new LoggerClass() as (LoggerType & LoggerClass);
