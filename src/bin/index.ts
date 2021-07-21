#!/usr/bin/env node
import { SystemSetup } from "../bootstrap/system-setup";
import Path from "path";
import fs from "fs";

const fileLocation = process.argv[2];

const relativePath = Path.join(process.cwd(), fileLocation);
const absolutePath = Path.join(fileLocation);
const setupProcess = new SystemSetup();


// eslint-disable-next-line max-lines-per-function
const main = async () : Promise<void> => {
  await setupProcess.execute();

  process.stdin.on("data", (data) => {
    if(data.toString().includes("rs")) {
      console.log("Restarting System...");
      void setupProcess.stop().then(() => {
        void setupProcess.execute();
      });
    }
  });

  process.on("SIGINT", () => {
    console.log("\nShutting down to to user input (SIGINT)");
    void setupProcess.stop().then(() => {
      process.exit(130);
    });
  });

  if (process.argv.includes("--dev")) {
    for (const path of [relativePath, absolutePath]) {
      if(fs.existsSync(path)) {
        fs.watchFile(path, () => {
          void setupProcess.stop()
            .then(void setupProcess.execute());
        });
        break;
      };
    }
  }
};

main().catch((e) => { throw e; });
