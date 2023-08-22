import chalk from "chalk";
import type { ChalkInstance } from "chalk";
import { LogLevelsType, logLevelsArray, Styles } from "./logger-types.js";
import { fullObject } from "./logging-utils.js";

const defaultColors : Record<LogLevelsType, ChalkInstance> = {
  fatal: chalk.red,
  success: chalk.green,
  operation: chalk.white,
  error: chalk.redBright,
  warn: chalk.yellow,
  info: chalk.blueBright,
  debug: chalk.cyanBright,
};


export const defaultStyleFunctions : Styles = (() : Styles => {
  const defaultStyling : Styles = { default: undefined };

  for(const level of logLevelsArray) {
    const color = defaultColors[level];
    const formattedLevel = level.toUpperCase();
    defaultStyling[level] = (data : unknown[]) : string => {
      const message = data.map(item => String(item)).join(" ");
      const date = chalk.magenta(new Date().toISOString());

      return `${color(`[${formattedLevel}]`)} :: ${date} :: ${color(message)}\n`;
    };
    // By default, only the debug level will attempt to "open" the entire object for performance reasons.
    // This avoids unnecessary `inspect` in arguments and checking in logger functions
    defaultStyling.debug = (data : unknown[]) : string => {
      const message = data.map(item => typeof item === "object" ? fullObject(item) : String(item)).join(" ");
      const date = chalk.magenta(new Date().toISOString());

      return `${color("["+level.toUpperCase()+"]")} :: ${date} :: ${color(message)}\n`;
    };
  }
  return defaultStyling;
})();
