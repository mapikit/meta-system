import { DeserializeConfigurationCommand } from "../../src/configuration/de-serialize-configuration.js";
import { expect } from "chai";
import { asyncTestThrow } from "../helpers/test-throw.js";
import { importJsonAndParse } from "../../src/common/helpers/import-json-and-parse.js";

describe("Configuration Deserializer", () => {
  let configurationExample;
  let badConfigurationExample;

  before(async () => {
    // eslint-disable-next-line max-len
    configurationExample = await importJsonAndParse("./test/configuration/test-data/configuration-example.json");
    // eslint-disable-next-line max-len
    badConfigurationExample = await importJsonAndParse("./test/configuration/test-data/configuration/bad-configuration-example.json");
  });

  // This suite just tests the base type - the Schemas and BOPS tests are written in other suites
  it("Successfully deserializes a valid configuration file", async () => {
    const command = new DeserializeConfigurationCommand();

    await command.execute(configurationExample);
    expect(command.result).to.not.be.undefined;
    expect(command.validation.errors.length).to.be.equal(0);
  });

  it("Fails do deserialize file with bad formatted configuration", async () => {
    const command = new DeserializeConfigurationCommand();

    const execution = async () : Promise<void> => { await command.execute(badConfigurationExample); };
    const result = await asyncTestThrow(execution);

    expect(result.thrown).to.be.true;
    console.error(result.error);
    expect(result.error.message).to.contain("Config validation failed!");
  });
});
