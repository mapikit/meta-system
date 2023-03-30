import { join } from "path";
import { ExternalFunctionManagerClass } from "../src/bops-functions/function-managers/external-function-manager.js";
import { ProtocolFunctionManagerClass } from "../src/bops-functions/function-managers/protocol-function-manager.js";
import { FunctionFileSystem } from "../src/bops-functions/installation/function-file-system.js";
import { FunctionsInstaller } from "../src/bops-functions/installation/functions-installer.js";
import { ProtocolFileSystem } from "../src/bops-functions/installation/protocol-file-system";
import { environment } from "../src/common/execution-env.js";
import { runtimeDefaults } from "../src/configuration/runtime-config/defaults.js";

const testPath = join(process.cwd(), "test-functions/");

environment.silent.constants.installDir = testPath;

const testFunctionFileSystem = new FunctionFileSystem(
  testPath,
  runtimeDefaults.externalFunctionConfigFileName,
  runtimeDefaults.externalPackageConfigFileName,
);
const testProtocolFileSystem = new ProtocolFileSystem(
  testPath,
  runtimeDefaults.externalProtocolConfigFileName,
);

const testInstaller = new FunctionsInstaller(testPath);
const testExternalManager = new ExternalFunctionManagerClass(testInstaller, testFunctionFileSystem);
const testProtocolManager = new ProtocolFunctionManagerClass(testInstaller, testProtocolFileSystem);

const purgeTestPackages = async () : Promise<void> => {
  await testInstaller.purgePackages();

  await testExternalManager.flush();
};

export { testInstaller, testFunctionFileSystem, testExternalManager, testProtocolManager, purgeTestPackages };
