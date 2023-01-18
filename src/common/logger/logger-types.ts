
export enum LogLevels {
  fatal,
  success,
  operation,
  error,
  warn,
  info,
  debug
}

export const logLevelsArray = Object.keys(LogLevels)
  .filter(key => !isNaN(Number(LogLevels[key]))) as LogLevelsType[];

export type LogLevelsType = keyof typeof LogLevels;

export type LoggerType = { [Level in LogLevelsType] : (...data : unknown[]) => void; };
export type StylingFunction = (data : unknown[]) => string
export type Styles =
  Partial<{ [Level in LogLevelsType] : StylingFunction }> &
  { default : StylingFunction }
