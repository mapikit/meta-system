import {
  CheckBopsFunctionsDependencies,
} from "@api/configuration/business-operations/check-bops-functions-dependencies";
import { expect } from "chai";


/* eslint-disable @typescript-eslint/no-var-requires */
const configurationExample = require("@test/configuration-de-serializer/test-data/configuration-example.json");
const unreferencedInput =
  require("@test/configuration-de-serializer/test-data/bops/unreferenced-input-dependency.json");
/* eslint-enable @typescript-eslint/no-var-requires */

describe("Check BOPS functions dependencies", () => {
  it("Successfully fetches and checks all dependencies", () => {
    const command = new CheckBopsFunctionsDependencies(
      configurationExample["schemas"],
      configurationExample["businessOperations"],
      configurationExample["businessOperations"][0],
    );

    const result = command.checkAllDependencies();

    expect(result).to.be.true;
  });

  it("Fails to check dependencies - inexistent Schema", () => {
    const command = new CheckBopsFunctionsDependencies(
      [],
      configurationExample["businessOperations"],
      configurationExample["businessOperations"][0],
    );

    const result = command.checkSchemaFunctionsDependenciesMet();

    expect(result).to.be.false;
  });

  it("Fails to check dependencies - unreferenced input", () => {
    const command = new CheckBopsFunctionsDependencies(
      unreferencedInput["schemas"],
      unreferencedInput["businessOperations"],
      unreferencedInput["businessOperations"][0],
    );

    const result = command.checkConfigurationalDependenciesMet();

    expect(result).to.be.false;
  });
});

