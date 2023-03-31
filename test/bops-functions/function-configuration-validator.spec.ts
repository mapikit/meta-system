
import { MetaFunctionDescriptionValidation }
  from "../../src/bops-functions/installation/functions-configuration-validation.js";
import { ModuleKind } from "../../src/bops-functions/installation/functions-installer.js";
import { expect } from "chai";
import { purgeTestPackages, testFunctionFileSystem, testInstaller } from "../test-managers.js";

describe("BOps Function Configuration Validator", () =>{
  const testFunctionName = "bops-function-hello-world";
  const testFunctionVersion = "1.1.2";

  afterEach(purgeTestPackages);

  it("Validates successfully a valid meta-function.json", async () => {
    await testInstaller.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);


    const metaFunctionContent = await testFunctionFileSystem
      .getDescriptionFile(testFunctionName, "function");

    const validator = new MetaFunctionDescriptionValidation(metaFunctionContent as object);

    const execution = () : unknown => validator.validate();

    expect(execution).to.not.throw;
  });

  it("Validates successfully a valid meta-function.json", async () => {
    await testInstaller.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);

    const metaFunctionContent = await testFunctionFileSystem
      .getDescriptionFile(testFunctionName, "function");

    const validator = new MetaFunctionDescriptionValidation(metaFunctionContent as object);

    validator.validate();

    expect(validator.getFunctionConfiguration().functionName).to.be.equal(testFunctionName);
    expect(validator.getFunctionConfiguration().version).to.be.equal(testFunctionVersion);
  });
});
