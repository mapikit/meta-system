#!/usr/bin/env node
import { SystemSetup } from "../bootstrap/system-setup";
import Path from "path";
import fs from "fs";
import packageData from "../../package.json";
import chalk from "chalk";
import { environment } from "../common/execution-env";

// eslint-disable-next-line max-lines-per-function
const main = async () : Promise<void> => {
  if (process.argv.includes("-v") || process.argv.includes("--version")) {
    console.log(`Running meta-system version ${packageData.version}`);
    return;
  }

  const fileLocation = process.argv[2];

  environment.constants.configPath = Path.resolve(fileLocation);
  environment.constants.configDir = Path.parse(environment.constants.configPath as string).dir;

  if(environment.constants.configPath === undefined) throw chalk.redBright("Config file not found");

  const setupProcess = new SystemSetup();

  setupProcess.execute().catch((error : Error) => {
    console.log(chalk.red(error.message));
    console.error(error.stack);
  });

  process.stdin.on("data", (data) => {
    if(data.toString().includes("rs")) setupProcess.restart();
  });

  if (process.argv.includes("--dev")) {
    fs.watchFile(environment.constants.configPath as string, () => setupProcess.restart());
  }
};

main().catch((e) => { throw e; });
