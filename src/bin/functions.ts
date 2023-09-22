import { environment } from "../common/execution-env.js";
import { getSystemInfo } from "../common/logger/get-system-info.js";
import { hookConsoleToFile } from "../common/logger/hook-console-to-file.js";
import { logger } from "../common/logger/logger.js";
import { runtimeDefaults } from "../configuration/runtime-config/defaults.js";
import { run } from "./commands.js";
import { ObjectDefinition } from "@meta-system/object-definition";
import ReadLine from "readline";
import { ExtendedJsonTypes } from "../common/types/json-types.js";
import { ExtendedJsonTypeDict } from "../configuration/business-operations/business-operations-type.js";
import { DeserializeConfigurationCommand } from "../configuration/de-serialize-configuration.js";
import { importJsonAndParse } from "../common/helpers/import-json-and-parse.js";


// eslint-disable-next-line max-lines-per-function
export async function main (fileLocation : string) : Promise<void> {
  Object.assign(environment.silent.constants, run.opts());
  const Path = await import("path");


  await logger.initialize(environment.constants.logLevel);

  environment.constants.configPath = Path.resolve(fileLocation);
  environment.constants.configDir = Path.parse(environment.constants.configPath).dir;
  environment.constants.installDir = Path.resolve(
    environment.constants.configDir,
    runtimeDefaults.defaultInstallFolder);
  if(environment.constants.configPath === undefined) throw "Config file not found";
  if(environment.constants.saveLog) await hookConsoleToFile(`${environment.constants.configDir}/logs`);

  logger.debug(getSystemInfo());

  logger.operation(`[System Setup] Searching system configuration in path: "${environment.constants.configPath}"`);

  const fileContent = await importJsonAndParse(environment.constants.configPath as string);
  if(!fileContent) throw Error("Config file not found");

  logger.success("[System Setup] File found - Validating content");

  const setupProcess = new (await import("../bootstrap/system-setup.js")).SystemSetup(fileContent);

  setupProcess.execute().catch((error : Error) => {
    logger.fatal(error?.message ?? "UNKNOWN ERROR");
    logger.fatal(error?.stack ?? "UNKNOWN ERROR");
    throw error;
  });
};

// eslint-disable-next-line max-lines-per-function
export async function testBopFunction (configPath : string, bopName : string) : Promise<void> {
  const Path = await import("path");

  await logger.initialize("debug");
  environment.constants.configPath = Path.resolve(configPath);
  environment.constants.configDir = Path.parse(environment.constants.configPath).dir;
  environment.constants.installDir = Path.resolve(
    environment.constants.configDir,
    runtimeDefaults.defaultInstallFolder);
  if(environment.constants.configPath === undefined) throw "Config file not found";

  logger.operation("[System Setup] System setup starting");
  logger.operation("[System Setup] Retrieving system configuration");
  logger.operation(`[System Setup] Searching system configuration in path: "${environment.constants.configPath}"`);

  const fileContent = await importJsonAndParse(environment.constants.configPath as string);
  if(!fileContent) throw Error("Config file not found");

  logger.success("[System Setup] File found - Validating content");

  const setupProcess = new (await import("../bootstrap/system-setup.js")).SystemSetup(fileContent);
  await setupProcess.execute();
  const functionsManager = setupProcess.functionsContext.systemBroker;
  const functionToTest = functionsManager.bopFunctions.getBopFunction(bopName);

  // functionToTest(JSON.parse(testInput));
  const deserializer = new DeserializeConfigurationCommand();
  await deserializer.execute(await importJsonAndParse(environment.constants.configPath));
  const bopInfo = deserializer.result.businessOperations.find(bop => bop.identifier === bopName);
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
    // TODO Resolve Union as well
    const expectedType = input[key]["type"];
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
  boolean: value => Boolean(value),
  string: value => String(value),
  number: value => Number(value),
  date: value => new Date(value),
  object: value => JSON.parse(value),
  array: value => Array.from(value),
  any: value => value,
};
