require("module-alias/register");
import { DeserializeBopsCommand } from "@api/configuration-de-serializer/domain/commands/de-serialize-bops";
// import { expect } from "chai";

/* eslint-disable @typescript-eslint/no-var-requires */
const configurationExample = require("@test/configuration-de-serializer/test-data/configuration-example.json");
/* eslint-enable @typescript-eslint/no-var-requires */

describe("BOPS Desserializer", () => {
  it("Desserializes a valid BOPS", () => {
    const command = new DeserializeBopsCommand();
    const configurations = configurationExample["businessOperations"];

    command.execute(configurations);

    // expect(command.bopsResults).to.not.be.undefined;
  });
});
