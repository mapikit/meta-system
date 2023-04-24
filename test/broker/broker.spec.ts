import { BrokerFactory } from "../../src/broker/entity-broker.js";

describe.only("Broker Tests", () => {
  it("Default Presence with logger", () => {
    const factory = new BrokerFactory();
    const broker = factory.build();

    broker["logger"]["fatal"]("NOT AN ERROR, THIS IS A TEST");
  });
});

