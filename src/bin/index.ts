#!/usr/bin/env node
import { SystemSetup } from "src/bootstrap/system-setup";

const main = async () : Promise<void> => {
  const setupProcess = new SystemSetup();
  await setupProcess.execute();
};

main().catch((e) => { throw e; });
