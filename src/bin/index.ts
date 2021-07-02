#!/usr/bin/env node
import "module-alias/register";
import { SystemSetup } from "@api/bootstrap/system-setup";


const main = async () : Promise<void> => {
  const setupProcess = new SystemSetup();
  await setupProcess.execute();
};

main().catch((e) => { throw e; });
