
import { ModuleKind } from "../../src/bops-functions/installation/functions-installer.js";
import { expect } from "chai";
import { random } from "faker";
import { purgeTestPackages, testInstaller } from "../test-managers";

describe("BOps Functions Installation (external functions)", () => {
  const testFunction = "bops-function-hello-world";
  const testFunctionVersion = "1.0.0";

  afterEach(purgeTestPackages);

  it("Installs a function correctly", async () => {
    const result = await testInstaller
      .install(testFunction, testFunctionVersion, ModuleKind.NPM);

    expect(result).to.be.undefined;
  });

  it("Fails to install a function - Function does not Exist", async () => {
    const resultFails = await testInstaller
      .install(random.alphaNumeric(15), random.alphaNumeric(6), ModuleKind.NPM)
      .catch(() => true);

    expect(resultFails).to.be.true;
  });

  it("Fails to install multiple versions of the same PACKAGE", async () => {
    const packageName = "logger-meta-functions";
    const packageVersion = "1.0.0";
    const packageVersion2 = "1.0.1";
    const successfullInstall = await testInstaller
      .install(packageName, packageVersion, ModuleKind.NPM);

    const failedInstall = await testInstaller
      .install(packageName, packageVersion2, ModuleKind.NPM)
      .catch(() => true);

    expect(successfullInstall).to.be.undefined;
    expect(failedInstall).to.be.true;
  });

  it("Fails to install multiple versions of the same FUNCTION", async () => {
    const successfullInstall = await testInstaller
      .install(testFunction, testFunctionVersion, ModuleKind.NPM);

    const versionBump = "1.1.1";
    const failedInstall = await testInstaller
      .install(testFunction, versionBump, ModuleKind.NPM)
      .catch(() => true);

    expect(successfullInstall).to.be.undefined;
    expect(failedInstall).to.be.true;
  });

  it("Fails to install multiple versions of the same PACKAGE - latest case", async () => {
    const packageName = "logger-meta-functions";
    const packageVersion = "1.0.0";
    const latestVersion = "latest";
    const successfullInstall = await testInstaller
      .install(packageName, packageVersion, ModuleKind.NPM);

    const failedInstall = await testInstaller
      .install(packageName, latestVersion, ModuleKind.NPM)
      .catch(() => true);

    expect(successfullInstall).to.be.undefined;
    expect(failedInstall).to.be.true;
  });

  it("Fails to install multiple versions of the same FUNCTION - latest case", async () => {
    const successfullInstall = await testInstaller
      .install(testFunction, testFunctionVersion, ModuleKind.NPM);

    const failedInstall = await testInstaller
      .install(testFunction, "latest", ModuleKind.NPM)
      .catch(() => true);

    expect(successfullInstall).to.be.undefined;
    expect(failedInstall).to.be.true;
  });

  it("Succeeds to install latest versions of the same PACKAGE", async () => {
    const packageName = "logger-meta-functions";
    const successfullInstall = await testInstaller
      .install(packageName, "latest", ModuleKind.NPM);

    const successfulRetry = await testInstaller
      .install(packageName, "latest", ModuleKind.NPM)
      .catch(() => true);

    expect(successfullInstall).to.be.undefined;
    expect(successfulRetry).to.be.undefined;
  });

  it("Succeeds to install latest versions of the same FUNCTION", async () => {
    const successfullInstall = await testInstaller
      .install(testFunction, "latest", ModuleKind.NPM);

    const successfulRetry = await testInstaller
      .install(testFunction, "latest", ModuleKind.NPM)
      .catch(() => true);

    expect(successfullInstall).to.be.undefined;
    expect(successfulRetry).to.be.undefined;
  });
});
