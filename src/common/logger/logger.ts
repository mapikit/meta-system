import constants from "../constants";
import { defaultStyleFunctions } from "./default-styler-functions";
import { LogLevelsType, LoggerType, LogLevels, logLevelsArray, Styles, StylingFunction } from "./logger-types";

export class LoggerClass {
  constructor () { this.initialize(constants.DEFAULT_LOG_LEVEL); }

  public initialize (logLevel : LogLevelsType, styles : Styles = defaultStyleFunctions) : LoggerType {

    for(const level of logLevelsArray) {
      const style : StylingFunction = styles[level] ?? styles.default ?? String;

      const inLogRange = LogLevels[logLevel] >= LogLevels[level];
      this[level] = inLogRange ?
        (...data : unknown[]) : void => { process.stdout.write(style(data)); } :
        () : void => { /* EMPTY LOG FUNCTION */ };
    }
    return logger as LoggerType;
  };
}

export const logger = new LoggerClass() as unknown as (LoggerType & LoggerClass);
