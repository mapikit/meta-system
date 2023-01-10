import chalk from "chalk";
import { ConfigurationType } from "..";
import { environment } from "../common/execution-env";
import { getSystemInfo } from "../common/logger/get-system-info";
import { hookConsoleToFile } from "../common/logger/hook-console-to-file";
import { logger } from "../common/logger/logger";
import { PathUtils } from "../configuration/path-alias-utils";
import { runtimeDefaults } from "../configuration/runtime-config/defaults";
import Path from "path";
import fs from "fs";
import { run } from "./commands";
import { ObjectDefinition } from "@meta-system/object-definition";
import ReadLine from "readline";
import { ExtendedJsonTypes } from "../common/types/json-types";
import { ExtendedJsonTypeDict } from "../configuration/business-operations/business-operations-type";
import { DeserializeConfigurationCommand } from "../configuration/de-serialize-configuration";


// eslint-disable-next-line max-lines-per-function
export async function main (fileLocation : string) : Promise<void> {
  Object.assign(environment.silent.constants, run.opts());


  logger.initialize(environment.constants.logLevel);

  environment.constants.configPath = Path.resolve(fileLocation);
  environment.constants.configDir = Path.parse(environment.constants.configPath).dir;
  environment.constants.installDir = Path.resolve(
    environment.constants.configDir,
    runtimeDefaults.defaultInstallFolder);
  if(environment.constants.configPath === undefined) throw chalk.redBright("Config file not found");
  if(environment.constants.saveLog) hookConsoleToFile(`${environment.constants.configDir}/logs`);

  logger.debug(getSystemInfo());

  const setupProcess = new (await import("../bootstrap/system-setup")).SystemSetup();

  const pathsToWatch = PathUtils.getFinalFilesPaths(await setupProcess.getFileContents() as ConfigurationType);
  pathsToWatch.push(environment.constants.configPath);

  setupProcess.execute().catch((error : Error) => {
    logger.fatal(error?.message ?? "UNKNOWN ERROR");
    logger.fatal(error?.stack ?? "UNKNOWN ERROR");
  });

  process.stdin.on("data", (data) => {
    if(data.toString().includes("rs")) setupProcess.restart();
  });

  // Disabled - Will be reimplemented in 0.5
  if (environment.constants.dev) {
    pathsToWatch.forEach(path => {
      logger.info("Watching file", path, "for quick restart");
      fs.watchFile(path as string, () => setupProcess.restart());
    });
  }
};

// eslint-disable-next-line max-lines-per-function
export async function testBopFunction (configPath : string, bopName : string) : Promise<void> {
  logger.initialize("debug");
  environment.constants.configPath = Path.resolve(configPath);
  environment.constants.configDir = Path.parse(environment.constants.configPath).dir;
  environment.constants.installDir = Path.resolve(
    environment.constants.configDir,
    runtimeDefaults.defaultInstallFolder);
  if(environment.constants.configPath === undefined) throw chalk.redBright("Config file not found");

  const setupProcess = new (await import("../bootstrap/system-setup")).SystemSetup();
  const functionsManager = await setupProcess.execute();
  const functionToTest = functionsManager.get(bopName);

  // functionToTest(JSON.parse(testInput));
  const deserializer = new DeserializeConfigurationCommand();
  await deserializer.execute(await import(environment.constants.configPath));
  const bopInfo = deserializer.result.businessOperations.find(bop => bop.name === bopName);
  await new Promise<void>(res => setTimeout(res, 500));
  while(true) {
    const input = resolveInputTypes(bopInfo.input, await getTestInput(bopInfo.input));
    console.log("Running BOP", bopName, "with inputs:", input);
    await functionToTest(input);
  }
}

function resolveInputTypes (input : ObjectDefinition, values : object) : object {
  const result = {};
  for(const key of Object.keys(values)) {
    const expectedType = input[key].type;
    result[key] = typeConversion[expectedType](values[key]);
  }
  return result;
}

// eslint-disable-next-line max-lines-per-function
async function getTestInput (inputInfo : ObjectDefinition) : Promise<object> {
  const result = {};

  if(Object.keys(inputInfo).length === 0) {
    const pressEnter = ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    await new Promise<void>(resolve => pressEnter.question("Press enter to run function...", () => {
      pressEnter.close();
      resolve();
    }));
  }
  for(const key of Object.keys(inputInfo)) {

    const rl = ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    result[key] = await new Promise(resolve => rl.question("Value for " + key + ":", ans => {
      rl.close();
      resolve(ans);
    }));
  }
  return result;
}

const typeConversion : Record<ExtendedJsonTypes, (value : string) => ExtendedJsonTypeDict> = {
  boolean: (value) => Boolean(value),
  string: (value) => String(value),
  number: value => Number(value),
  date: value => new Date(value),
  object: value => JSON.parse(value),
  array: value => Array.from(value),
  any: value => value,
};