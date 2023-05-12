import { FunctionsContext } from "../../src/entities/functions-context.js";

describe("functions context", () => {
  it("Functions context test DUH", () => {
    const factory = new FunctionsContext();
    const broker = factory.createBroker([{ entity: "schemaFunctions",
      permissions: ["set_functions", "get_functions"] }]);

    broker["logger"]["fatal"]("NOT AN ERROR, THIS IS A TEST");
    broker.schemaFunctions.setSchemaFunction("mySchema", () => { console.log("i exist!"); },
      { functionName: "nn" },
    );

    broker.schemaFunctions.getSchemaFunction("nn", "mySchema")();

  });
});

