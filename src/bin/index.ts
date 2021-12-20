#!/usr/bin/env node
import { SystemSetup } from "../bootstrap/system-setup";
import Path from "path";
import fs from "fs";
import packageData from "../../package.json";
import chalk from "chalk";
import { environment } from "../common/execution-env";
import { Command, Option } from "commander";
import { LogLevelsType, logLevelsArray } from "../common/logger/logger-types";
import constants from "../common/constants";
import { hookConsoleToFile } from "../common/logger/hook-console-to-file";
import { logger } from "../common/logger/logger";
import { getSystemInfo } from "../common/logger/get-system-info";

const program = new Command("meta-system");
program
  .showSuggestionAfterError(true)
  .helpOption("-h, --help", "Displays this help panel")
  .version("Currently on version " + packageData.version, "-v, --version", "Displays the current meta-system version")
  .option("-d, --debug", "Logs additional info on the execution of BOps", () => {
    environment.constants.logLevel = "debug";
  })
  .option("-L, --create-log-file, --log-file", "Saves logs to a file inside logs folder")
  //.option("-D, --dev", "Automatically restarts the system on config file update")
  // Currently disabled, will be re-enabled in 0.5 with file splitting support
  .addOption(
    new Option("-l, --log-level <level>", "Sets the logging level")
      .choices(logLevelsArray)
      .default(constants.DEFAULT_LOG_LEVEL))
  .addOption(
    new Option("-t, --type-check <level>", "Type checking level")
      .choices(["0", "1", "2", "3", "4"])
      .default("1"))
  .argument("<config-path>", "The path to your system configuration json", main);
program.parse();

// eslint-disable-next-line max-lines-per-function
async function main (fileLocation : string) : Promise<void> {
  Object.assign(environment.constants, program.opts());
  logger.initialize(environment.constants.logLevel as LogLevelsType);

  environment.constants.configPath = Path.resolve(fileLocation);
  environment.constants.configDir = Path.parse(environment.constants.configPath as string).dir;

  if(environment.constants.configPath === undefined) throw chalk.redBright("Config file not found");
  if(environment.constants.saveLog) hookConsoleToFile(`${environment.constants.configDir}/logs`);

  logger.debug(getSystemInfo());

  const setupProcess = new SystemSetup();

  setupProcess.execute().catch((error : Error) => {
    logger.fatal(error.message);
    logger.fatal(error.stack);
  });

  process.stdin.on("data", (data) => {
    if(data.toString().includes("rs")) setupProcess.restart();
  });

  if (environment.constants.dev) {
    fs.watchFile(environment.constants.configPath as string, () => setupProcess.restart());
  }
};

