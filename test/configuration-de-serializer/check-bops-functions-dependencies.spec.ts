import {
  CheckBopsFunctionsDependenciesCommand,
} from "@api/configuration/business-operations/check-bops-functions-dependencies";
import { expect } from "chai";


/* eslint-disable @typescript-eslint/no-var-requires */
const configurationExample = require("@test/configuration-de-serializer/test-data/configuration-example.json");
const unreferencedInput =
  require("@test/configuration-de-serializer/test-data/bops/unreferenced-input-dependency.json");
/* eslint-enable @typescript-eslint/no-var-requires */

describe("Check BOPS functions dependencies", () => {
  it("Successfully fetches and checks all dependencies", () => {
    const command = new CheckBopsFunctionsDependenciesCommand(
      configurationExample["schemas"],
    );

    command.execute(configurationExample["businessOperations"][0]);
  });

  it("Fails to check dependencies - inexistent Schema", () => {
    const command = new CheckBopsFunctionsDependenciesCommand(
      [],
    );

    const execution = () : void => command.execute(configurationExample["businessOperations"][0]);

    expect(execution).to.throw("Required Schema \"car\" was not provided in the configuration");
  });

  it("Fails to check dependencies - unreferenced input", () => {
    const command = new CheckBopsFunctionsDependenciesCommand(
      unreferencedInput["schemas"],
    );

    const execution = () : void => command.execute(unreferencedInput["businessOperations"][0]);

    expect(execution).to.throw(
      "There is an error on the configuration: Unmet dependency from inputs or constants \"!unreferenced\"",
    );
  });
});

