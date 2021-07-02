import "module-alias/register";
import { SystemSetup } from "./bootstrap/function/system-setup";


const main = async () : Promise<void> => {
  const setupProcess = new SystemSetup();
  await setupProcess.execute();
};

main().catch((e) => { throw e; });
