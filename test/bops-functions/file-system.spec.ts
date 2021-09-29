
import { ModuleKind } from "../../src/bops-functions/installation/functions-installer";
import { expect } from "chai";
import { purgeTestPackages, testFunctionFileSystem, testInstaller } from "../test-managers";

describe("File System BOps", () => {
  const testFunctionName = "bops-function-hello-world";
  const testFunctionVersion = "1.0.0";
  const mainFunctionName = "main";
  const entrypoint = "dist/index.js";

  before(purgeTestPackages);
  afterEach(purgeTestPackages);

  it("Retrieve function configuration file", async () => {
    await testInstaller.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);


    const result = await testFunctionFileSystem.getDescriptionFile(testFunctionName, "function");

    expect(result).to.contain(`"functionName": "${testFunctionName}"`);
    expect(result).to.contain(`"version": "${testFunctionVersion}"`);
  });

  it("Imports Main Function from file", async () => {
    await testInstaller.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);

    const mainFunction = await testFunctionFileSystem
      .import(testFunctionName, entrypoint, mainFunctionName);

    expect(typeof mainFunction).to.be.equal("function");
  });
});
