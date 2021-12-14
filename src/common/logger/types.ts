
export enum LoggingLevels {
  fatal,
  success,
  operation,
  error,
  warn,
  info,
  debug
}

export type AvailableLogLevels = keyof typeof LoggingLevels;

export type Logger = { [Level in AvailableLogLevels] : (...data : unknown[]) => void; }
export type StylingFunction = (header : AvailableLogLevels, date : Date, data : unknown[]) => string
export type Styling = Partial<{ [Level in AvailableLogLevels | "default"] : StylingFunction }>
