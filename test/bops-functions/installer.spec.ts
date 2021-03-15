require("module-alias/register");
import { FunctionsInstaller, ModuleKind } from "@api/bops-functions/installation/functions-installer";
import { expect } from "chai";
import { random } from "faker";
import Path from "path";

describe("BOps Functions Installation (external functions)", () => {
  const testFunction = "bops-function-hello-world";
  const testFunctionVersion = "1.0.0";
  const functionInstallLocation = "./test-functions";
  const workingDirectory = process.cwd();

  const installationHandler = new FunctionsInstaller(
    Path.join(workingDirectory, functionInstallLocation),
  );

  it("Installs a function correctly", async () => {
    const result = await installationHandler
      .install(testFunction, testFunctionVersion, ModuleKind.NPM);

    expect(result).to.be.undefined;
  });

  it("Fails to install a function - Function does not Exist", async () => {
    const resultFails = await installationHandler
      .install(random.alphaNumeric(15), random.alphaNumeric(6), ModuleKind.NPM)
      .catch(() => true);

    expect(resultFails).to.be.true;
  });

  after(async () => {
    await installationHandler.purgePackages()
      .catch(() => {
        throw Error("Failed to purge test packaged during test! Aborting!");
      });
  });
});
