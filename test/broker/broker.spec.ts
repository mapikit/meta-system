import { BrokerEntityFactory, EntityAction } from "../../src/broker/entity-broker.js";

describe.only("Broker Tests", () => {
  const brokerFactory = new BrokerEntityFactory();

  const actionA = new EntityAction(
    "A",
    "setEntValue",
    (ent) => (val : string) : void => {
      ent["myValue"] = val; console.log("modiFying Entity", ent);
    });

  it("Idiot test", () => {
    const origEnt = { myValue: "hello" };
    const myBrokerEntity = brokerFactory
      .usingEntity(origEnt, "me")
      .withPermissions(["A", "B"])
      .withAction(actionA)
      .build();

    myBrokerEntity["setEntValue"]("bodia caralho");
    console.log(myBrokerEntity, origEnt);

    myBrokerEntity.done();

    console.log(myBrokerEntity);
  });
});

