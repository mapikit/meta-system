import { DeserializeConfigurationCommand } from
  "@api/configuration-de-serializer/domain/commands/de-serialize-configuration";
import { expect } from "chai";

/* eslint-disable @typescript-eslint/no-var-requires */
const configurationExample = require("@test/configuration-de-serializer/test-data/configuration-example.json");
const badConfigurationExample =
  require("@test/configuration-de-serializer/test-data/configuration/bad-configuration-example.json");
/* eslint-enable @typescript-eslint/no-var-requires */

describe("Configuration Deserializer", () => {
  // This just tests the base type - the Schemas and BOPS tests are written in other suites
  it("Successfully deserializes a valid configuration file", () => {
    const command = new DeserializeConfigurationCommand();

    command.execute(configurationExample);

    expect(command.result).to.not.be.undefined;
  });

  it("Fails do deserialize file with bad formatted configuration", () => {
    const command = new DeserializeConfigurationCommand();

    const execution = () : void => { command.execute(badConfigurationExample); };

    expect(execution).to.throw("\"version\" should be a string: Not type string - Type is number");
  });
});
