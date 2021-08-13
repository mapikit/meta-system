
import { FunctionFileSystem } from "../../src/bops-functions/installation/function-file-system";
import { MetaFunctionDescriptionValidation }
  from "../../src/bops-functions/installation/functions-configuration-validation";
import { FunctionsInstaller, ModuleKind } from "../../src/bops-functions/installation/functions-installer";
import { expect } from "chai";
import Path from "path";

describe("BOps Function Configuration Validator", () =>{
  const testFunctionName = "bops-function-hello-world";
  const testFunctionVersion = "1.1.1";
  const functionInstallLocation = "./test-functions";
  const workingDirectory = process.cwd();
  const configurationFileName = "meta-function.json";
  const packageFileName = "meta-package.json";

  const installationPath = Path.join(workingDirectory, functionInstallLocation);

  const installationHandler = new FunctionsInstaller(installationPath);

  afterEach(async () => {
    await installationHandler.purgePackages();
  });

  it("Validates successfully a valid meta-function.json", async () => {
    await installationHandler.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);

    const functionFileSystem = new FunctionFileSystem(installationPath, configurationFileName, packageFileName);

    const metaFunctionContent = await functionFileSystem
      .getDescriptionFile(testFunctionName, "function");

    const validator = new MetaFunctionDescriptionValidation(metaFunctionContent);

    const execution = () : unknown => validator.validate();

    expect(execution).to.not.throw;
  });

  it("Validates successfully a valid meta-function.json", async () => {
    await installationHandler.install(testFunctionName, testFunctionVersion, ModuleKind.NPM);

    const functionFileSystem = new FunctionFileSystem(installationPath, configurationFileName, packageFileName);

    const metaFunctionContent = await functionFileSystem
      .getDescriptionFile(testFunctionName, "function");

    const validator = new MetaFunctionDescriptionValidation(metaFunctionContent);

    validator.validate();

    expect(validator.getFunctionConfiguration().functionName).to.be.equal(testFunctionName);
    expect(validator.getFunctionConfiguration().version).to.be.equal(testFunctionVersion);
  });
});
