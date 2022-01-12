import { join } from "path";
import { ExternalFunctionManagerClass } from "../src/bops-functions/function-managers/external-function-manager";
import { ProtocolFunctionManagerClass } from "../src/bops-functions/function-managers/protocol-function-manager";
import { FunctionFileSystem } from "../src/bops-functions/installation/function-file-system";
import { FunctionsInstaller } from "../src/bops-functions/installation/functions-installer";
import { ProtocolFileSystem } from "../src/bops-functions/installation/protocol-file-system";
import { runtimeDefaults } from "../src/configuration/runtime-config/defaults";

const testPath = join(process.cwd(), "test-functions/");

runtimeDefaults.defaultInstallFolder = testPath;

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
  await testInstaller.purgePackages()
    .catch(error => { throw error; });

  await testExternalManager.flush();
};

export { testInstaller, testFunctionFileSystem, testExternalManager, testProtocolManager, purgeTestPackages };
