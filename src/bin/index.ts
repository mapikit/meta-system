#!/usr/bin/env node
import { Command } from "commander";
import { run, testBop, test } from "./commands.js";
import { importJsonAndParse } from "../common/helpers/import-json-and-parse.js";

const program = new Command("meta-system");

const main = async (): Promise<void> => {
  let packageFile;
  if (process && process.cwd()) {
    const libraryPath = process.platform === "win32" ?
      new URL(import.meta.url).pathname.replace("/", "") : new URL(import.meta.url).pathname;
    packageFile = await importJsonAndParse("../../../package.json", libraryPath);
  }

  program
    .showSuggestionAfterError(true)
    .helpOption("-h, --help", "Displays this help panel")
    .version("Currently on version " + packageFile.version, "-v, --version", "Displays the current meta-system version")
    .addCommand(run)
    .addCommand(test)
    .addCommand(testBop);
  program.parse();

};

main().catch((error) => {
  console.error("Meta-System exited with an error ", error);
  throw error;
});
// eslint-disable-next-line max-lines-per-function
