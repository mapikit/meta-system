#!/usr/bin/env node
import { SystemSetup } from "../bootstrap/system-setup";
import Path from "path";
import fs from "fs";

import packageData from "../../package.json";

// eslint-disable-next-line max-lines-per-function
const main = async () : Promise<void> => {
  if (process.argv.includes("-v") || process.argv.includes("--version")) {
    console.log(`Running meta-system version ${packageData.version}`);
    return;
  }

  const fileLocation = process.argv[2];

  const relativePath = Path.join(process.cwd(), fileLocation);
  const absolutePath = Path.join(fileLocation);
  const setupProcess = new SystemSetup();

  await setupProcess.execute();

  process.stdin.on("data", (data) => {
    if(data.toString().includes("rs")) setupProcess.restart();
  });

  if (process.argv.includes("--dev")) {
    let filePath : string;
    for (const path of [relativePath, absolutePath]) {
      if(fs.existsSync(path)) filePath = path;
    }
    if(filePath !== undefined) fs.watchFile(filePath, () => setupProcess.restart());
    else console.warn("File to watch for was not found; System will not restart automatically");
  }
};

main().catch((e) => { throw e; });
