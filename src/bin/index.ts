#!/usr/bin/env node
import { Command } from "commander";
import { run, testBop } from "./commands.js";

const program = new Command("meta-system");

const main = async () : Promise<void> => {
  let packageFile;
  if (process && process.cwd()) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore I KNOW WHAT I'M DOING
    packageFile = (await import("../../package.json", { assert: { type: "json" } }))["default"];
  }

  program
    .showSuggestionAfterError(true)
    .helpOption("-h, --help", "Displays this help panel")
    .version("Currently on version " + packageFile.version, "-v, --version", "Displays the current meta-system version")
    .addCommand(run)
    .addCommand(testBop);
  program.parse();

};

main().catch((error) => {
  console.error("Meta-System exited with an error ", error);
  throw error;
});
// eslint-disable-next-line max-lines-per-function
