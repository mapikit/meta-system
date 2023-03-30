import { DeserializeConfigurationCommand } from "../../src/configuration/de-serialize-configuration.js";
import { expect } from "chai";
import { asyncTestThrow } from "../helpers/test-throw";

/* eslint-disable @typescript-eslint/no-var-requires */
const configurationExample = require("./test-data/configuration-example.json");
const badConfigurationExample =
  require("./test-data/configuration/bad-configuration-example.json");
/* eslint-enable @typescript-eslint/no-var-requires */

describe("Configuration Deserializer", () => {
  // This suite just tests the base type - the Schemas and BOPS tests are written in other suites
  it("Successfully deserializes a valid configuration file", async () => {
    const command = new DeserializeConfigurationCommand();

    await command.execute(configurationExample);

    expect(command.result).to.not.be.undefined;
  });

  it("Fails do deserialize file with bad formatted configuration", async () => {
    const command = new DeserializeConfigurationCommand();

    const execution = async () : Promise<void> => { await command.execute(badConfigurationExample); };
    const result = await asyncTestThrow(execution);

    expect(result.thrown).to.be.true;
    console.error(result.error);
    expect(result.error.message).to.contain("\"version\" should be a string: Not type string - Type is number");
  });
});
