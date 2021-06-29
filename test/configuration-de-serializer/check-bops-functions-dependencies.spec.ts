import { ExternalFunctionManagerClass } from "@api/bops-functions/function-managers/external-function-manager";
import internalFunctionManager from "@api/bops-functions/function-managers/internal-function-manager";
import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { FunctionsInstaller } from "@api/bops-functions/installation/functions-installer";
import {
  CheckBopsFunctionsDependencies,
} from "@api/configuration/business-operations/check-bops-functions-dependencies";
import { expect } from "chai";
import Path from "path";


/* eslint-disable @typescript-eslint/no-var-requires */
const configurationExample = require("@test/configuration-de-serializer/test-data/configuration-example.json");
const unreferencedInput =
  require("@test/configuration-de-serializer/test-data/bops/unreferenced-input-dependency.json");
/* eslint-enable @typescript-eslint/no-var-requires */

describe("Check BOPS functions dependencies", () => {
  const functionsFolder = "test-functions";
  const installationHandler = new FunctionsInstaller(functionsFolder);
  const installPath = Path.join(process.cwd(), functionsFolder);
  const fileSystem = new FunctionFileSystem(installPath, "meta-function.json");
  const externalFunctionHandler = new ExternalFunctionManagerClass(installationHandler, fileSystem);

  it("Successfully fetches and checks all dependencies", () => {
    const command = new CheckBopsFunctionsDependencies(
      configurationExample["schemas"],
      configurationExample["businessOperations"],
      configurationExample["businessOperations"][0],
      externalFunctionHandler,
      internalFunctionManager,
    );

    const result = command.checkAllDependencies();

    expect(result).to.be.true;
  });

  it("Fails to check dependencies - inexistent Schema", () => {
    const command = new CheckBopsFunctionsDependencies(
      [],
      configurationExample["businessOperations"],
      configurationExample["businessOperations"][0],
      externalFunctionHandler,
      internalFunctionManager,
    );

    const result = command.checkSchemaFunctionsDependenciesMet();

    expect(result).to.be.false;
  });

  it("Fails to check dependencies - unreferenced input", () => {
    const command = new CheckBopsFunctionsDependencies(
      unreferencedInput["schemas"],
      unreferencedInput["businessOperations"],
      unreferencedInput["businessOperations"][0],
      externalFunctionHandler,
      internalFunctionManager,
    );

    const result = command.checkConfigurationalDependenciesMet();

    expect(result).to.be.false;
  });
});

