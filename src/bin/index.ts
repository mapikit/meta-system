#!/usr/bin/env node
import { Command } from "commander";
import { run, testBop } from "./commands.js";

const program = new Command("meta-system");

const main = async () => {
  let packageFile;
  if (process && process.cwd()) {
    const fsLib = await import("fs");
    const pathLib = await import("path");

    packageFile = JSON.parse(fsLib.readFileSync(pathLib.resolve(process.cwd(), "./package.json")).toString());
  }
  
  program
    .showSuggestionAfterError(true)
    .helpOption("-h, --help", "Displays this help panel")
    .version("Currently on version " + packageFile.version, "-v, --version", "Displays the current meta-system version")
    .addCommand(run)
    .addCommand(testBop);
  program.parse();
  
}

main().catch((error) => {
  console.error("Meta-System exited with an error ", error)
  throw error;
})
// eslint-disable-next-line max-lines-per-function
