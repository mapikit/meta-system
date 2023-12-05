import { Command } from "commander";
import { environment } from "./execution-env.js";
import { logger } from "./logger/logger.js";
import { runtimeDefaults } from "../configuration/runtime-config/defaults.js";

export const environmentStart = async (
  fileLocation : string,
  withDefaults = true,
  command ?: Command,
) : Promise<void> => {
  if (command !== undefined)  Object.assign(environment.silent.constants, command.opts());
  const Path = await import("path");

  await logger.initialize(environment.constants.logLevel);

  environment.constants.configPath = Path.resolve(fileLocation);
  environment.constants.configDir = Path.parse(environment.constants.configPath).dir;

  if (withDefaults) {
    environment.constants.installDir = Path.resolve(
      environment.constants.configDir,
      runtimeDefaults.defaultInstallFolder);
  }
};
