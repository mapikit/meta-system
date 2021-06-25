require("module-alias/register");
import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { MetaFunctionDescriptionValidation } from "@api/bops-functions/installation/functions-configuration-validation";
import { FunctionsInstaller, ModuleKind } from "@api/bops-functions/installation/functions-installer";
import { expect } from "chai";
import Path from "path";

describe("BOps Function Configuration Validator", () =>{
  const testFunctionName = "bops-function-hello-world";
  const testFunctionVersion = "1.1.1";
  const functionInstallLocation = "./test-functions";
  const workingDirectory = process.cwd();
  const configurationFileName = "meta-function.json";

  const installationHandler = new FunctionsInstaller(
    Path.join(workingDirectory, functionInstallLocation),
  );

  afterEach(async () => {
    await installationHandler.purgePackages();
  });

  it("Validates successfully a valid meta-function.json", async () => {
    await installationHandler.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);

    const functionFileSystem = new FunctionFileSystem(
      workingDirectory, functionInstallLocation, configurationFileName,
    );

    const metaFunctionContent = await functionFileSystem
      .getFunctionDescriptionFile(testFunctionName);

    const validator = new MetaFunctionDescriptionValidation(metaFunctionContent);

    const execution = () : void => validator.validate();

    expect(execution).to.not.throw;
  });

  it("Validates successfully a valid meta-function.json", async () => {
    await installationHandler.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);

    const functionFileSystem = new FunctionFileSystem(
      workingDirectory, functionInstallLocation, configurationFileName,
    );

    const metaFunctionContent = await functionFileSystem
      .getFunctionDescriptionFile(testFunctionName);

    const validator = new MetaFunctionDescriptionValidation(metaFunctionContent);

    validator.validate();

    expect(validator.getFunctionConfiguration().functionName).to.be.equal(testFunctionName);
    expect(validator.getFunctionConfiguration().version).to.be.equal(testFunctionVersion);
  });
});
