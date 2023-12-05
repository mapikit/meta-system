import { LogLevelsType, logLevelsArray, Styles } from "./logger-types.js";

const defaultColors : Record<LogLevelsType, (str : string) => string> = {
  fatal: (str : string) => str,
  success: (str : string) => str,
  operation: (str : string) => str,
  error: (str : string) => str,
  warn: (str : string) => str,
  info: (str : string) => str,
  debug: (str : string) => str,
};

async function getChalkColors () : Promise<void> {
  const res = await import("chalk");
  defaultColors.fatal = res.default.red;
  defaultColors.success = res.default.green;
  defaultColors.operation = res.default.white;
  defaultColors.error = res.default.redBright;
  defaultColors.warn = res.default.yellow;
  defaultColors.info = res.default.blueBright;
  defaultColors.debug = res.default.cyanBright;
}


// eslint-disable-next-line max-lines-per-function
export async function getDefaultStyleFunctions () : Promise<Styles> {
  const defaultStyling : Styles = { default: undefined };
  await getChalkColors();

  const { fullObject } = await import("./logging-utils.js");


  for(const level of logLevelsArray) {
    const color = defaultColors[level];
    const formattedLevel = level.toUpperCase();
    defaultStyling[level] = (data : unknown[]) : string => {
      const message = data.map(item => String(item)).join(" ");
      const date = new Date().toISOString();

      return `${color(`[${formattedLevel}]`)} :: ${date} :: ${color(message)}\n`;
    };
    // By default, only the debug level will attempt to "open" the entire object for performance reasons.
    // This avoids unnecessary `inspect` in arguments and checking in logger functions
    defaultStyling.debug = (data : unknown[]) : string => {
      const message = data.map(item => typeof item === "object" ? fullObject(item) : String(item)).join(" ");
      const date = new Date().toISOString();

      return `${color("["+level.toUpperCase()+"]")} :: ${date} :: ${color(message)}\n`;
    };
  }
  return defaultStyling;
};
