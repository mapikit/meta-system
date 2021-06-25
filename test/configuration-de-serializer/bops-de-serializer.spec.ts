require("module-alias/register");
import { DeserializeBopsCommand } from "@api/configuration/business-operations/de-serialize-bops";
import { expect } from "chai";

/* eslint-disable @typescript-eslint/no-var-requires */
const configurationExample = require("@test/configuration-de-serializer/test-data/configuration-example.json");
const faultyBops = require("@test/configuration-de-serializer/test-data/bops/faulty-bops.json");
const customObjectLoop = require("@test/configuration-de-serializer/test-data/bops/custom-objects-loop.json");
const configurationLoop = require("@test/configuration-de-serializer/test-data/bops/configuration-loop.json");
/* eslint-enable @typescript-eslint/no-var-requires */

describe("BOPS Desserializer", () => {
  it("Desserializes a valid BOp", () => {
    const command = new DeserializeBopsCommand();
    const configurations = configurationExample["businessOperations"];

    command.execute(configurations);

    expect(command.bopsResults.length).to.be.at.least(1);
  });

  it("Fails to deserialize faulty BOp [name wrong type]", () => {
    const command = new DeserializeBopsCommand();
    const configurations = faultyBops["businessOperations"];

    expect(() => command.execute(configurations)).to.throw(
      "Business Operation with incorrect format: Not type string - Type is number",
    );
  });

  it("Fails to deserialize BOp - Custom Objects Loop", () => {
    const command = new DeserializeBopsCommand();
    const configurations = customObjectLoop["businessOperations"];

    expect(() => command.execute(configurations)).to
      .throw("Loop reference detected on the custom objects of the business operation car-sell");
  });

  it.skip("Fails to deserialize BOp - Loop on the modules configuration", () => {
    const command = new DeserializeBopsCommand();
    const configurations = configurationLoop["businessOperations"];

    expect(() => command.execute(configurations)).to
      .throw("Duplicated entry in one the branches of the configuration for BOPS car-sell");
  });
});
