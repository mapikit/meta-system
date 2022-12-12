#!/usr/bin/env node
import packageData from "../../package.json";
import { Command } from "commander";
import { run, testBop } from "./commands";

const program = new Command("meta-system");
program
  .showSuggestionAfterError(true)
  .helpOption("-h, --help", "Displays this help panel")
  .version("Currently on version " + packageData.version, "-v, --version", "Displays the current meta-system version")
  .addCommand(run)
  .addCommand(testBop);
program.parse();

// eslint-disable-next-line max-lines-per-function

