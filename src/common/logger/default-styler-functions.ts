import chalk, { Chalk } from "chalk";
import { AvailableLogLevels, StylingFunction } from "./types";

export const defaultColors : Record<AvailableLogLevels, Chalk> = {
  fatal: chalk.red,
  success: chalk.green,
  operation: chalk.white,
  error: chalk.redBright,
  warn: chalk.yellow,
  info: chalk.blueBright,
  debug: chalk.cyanBright,
};


export const defaultStyler : StylingFunction = (header : AvailableLogLevels, date : Date, messages : string[]) => {
  return `${defaultColors[header]("["+header.toUpperCase()+"]")} :: ` +
    `${chalk.magenta(date.toISOString())} :: ${defaultColors[header](messages.join(" "))}` ;
};


