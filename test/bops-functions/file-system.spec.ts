
import { FunctionFileSystem } from "../../src/bops-functions/installation/function-file-system";
import { FunctionsInstaller, ModuleKind } from "../../src/bops-functions/installation/functions-installer";
import { expect } from "chai";
import Path from "path";

describe("File System BOps", () => {
  const testFunctionName = "bops-function-hello-world";
  const testFunctionVersion = "1.0.0";
  const functionInstallLocation = "./test-functions";
  const workingDirectory = process.cwd();
  const configurationFileName = "meta-function.json";
  const packageFileName = "meta-package.json";
  const mainFunctionName = "main";
  const entrypoint = "dist/index.js";
  const installationPath = Path.join(workingDirectory, functionInstallLocation);

  const installationHandler = new FunctionsInstaller(
    installationPath,
  );

  before(async () => { //Previous tests may leave packages installed
    await installationHandler.purgePackages();
  });

  afterEach(async () => {
    await installationHandler.purgePackages();
  });

  it("Retrieve function configuration file", async () => {
    await installationHandler.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);

    const functionFileSystem = new FunctionFileSystem(
      installationPath, configurationFileName, packageFileName,
    );

    const result = await functionFileSystem.getDescriptionFile(testFunctionName, "function");

    expect(result).to.contain(`"functionName": "${testFunctionName}"`);
    expect(result).to.contain(`"version": "${testFunctionVersion}"`);
  });

  it("Imports Main Function from file", async () => {
    await installationHandler.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);

    const functionFileSystem = new FunctionFileSystem(
      installationPath, configurationFileName, packageFileName,
    );

    const mainFunction = await functionFileSystem
      .import(testFunctionName, entrypoint, mainFunctionName);

    expect(typeof mainFunction).to.be.equal("function");
  });
});
