#!/usr/bin/env node
import { SystemSetup } from "../bootstrap/system-setup";
import Path from "path";
import fs from "fs";
import packageData from "../../package.json";
import chalk from "chalk";

// eslint-disable-next-line max-lines-per-function
const main = async () : Promise<void> => {
  if (process.argv.includes("-v") || process.argv.includes("--version")) {
    console.log(`Running meta-system version ${packageData.version}`);
    return;
  }

  const fileLocation = process.argv[2];

  process.env.configPath = Path.resolve(fileLocation);
  process.env.configDir = Path.parse(process.env.configPath).dir;

  if(process.env.configPath === undefined) throw chalk.redBright("Config file not found");

  const setupProcess = new SystemSetup();

  setupProcess.execute().catch((error : Error) => {
    console.log(chalk.red(error.message));
    console.error(error.stack);
  });

  process.stdin.on("data", (data) => {
    if(data.toString().includes("rs")) setupProcess.restart();
  });

  if (process.argv.includes("--dev")) {
    fs.watchFile(process.env.configPath, () => setupProcess.restart());
  }
};

main().catch((e) => { throw e; });
