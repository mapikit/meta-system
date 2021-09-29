
import { ModuleKind } from "../../src/bops-functions/installation/functions-installer";
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
});
