import { Command, Option } from "commander";
import constants from "../common/constants";
import { environment } from "../common/execution-env.js";
import { parseInteger } from "../common/helpers/parsers";
import { logLevelsArray } from "../common/logger/logger-types";
import { testBopFunction, main } from "./functions";

const testBop = new Command("test-bop")
  .argument("<config>", "The config file")
  .argument("<bop>", "The bop name")
  .action(testBopFunction);

const run = new Command("run")
  .description("Runs the given file")
  .argument("<config-path>", "The path to your system configuration json")
  .action(main)
  .option("-d, --debug", "Logs additional info on the execution of BOps", () => {
    environment.silent.constants.logLevel = "debug";
  })
  .option("-L, --create-log-file, --log-file", "Saves logs to a file inside logs folder")
  .option("-S, --skip-prop-validation", "Skips validation of properties types")
  .option("-D, --dev", "Automatically restarts the system on config file update")
  // Currently disabled, will be re-enabled in 0.5 with file splitting support
  .addOption(
    new Option("-l, --log-level <level>", "Sets the logging level")
      .choices(logLevelsArray)
      .default(constants.DEFAULT_LOG_LEVEL))
  .addOption(
    new Option("-t, --type-check <level>", "Type checking level")
      .argParser(parseInteger)
      .choices(["0", "1", "2", "3", "4"])
      .default(1))
  .addOption(
    new Option("-T, --ttl, --time-to-live <time>", "Maximum execution time of a BOp in ms")
      .argParser(parseInteger)
      .default(2000));


export { testBop, run };
