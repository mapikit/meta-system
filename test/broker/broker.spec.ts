import { BrokerEntityFactory } from "../../src/broker/broker-entity.js";
import { EntityRepository } from "../../src/entities/repository.js";
import { EntityAction } from "../../src/entities/entity-action.js";
import { MetaEntity } from "../../src/entities/meta-entity.js";

const aSchema = new MetaEntity("", { identifier: "1234", anotherValue: "hello" });
const repoSingleton : Array<typeof aSchema> = [];
repoSingleton.push(aSchema);

const repo = new EntityRepository(repoSingleton);

describe.only("Broker Tests", () => {
  const brokerFactory = new BrokerEntityFactory();

  const actionA = new EntityAction(
    "A",
    "readList",
    (rep) => () : object => {
      return rep;
    });

  it("Idiot test", () => {
    const origEnt = [{}, {}, {}];
    const aSchemaBrokerEntity = brokerFactory
      .usingRepository(repo)
      .withPermissions(["A", "B"])
      .withAction(actionA)
      .build();

    console.log(aSchemaBrokerEntity["readList"](), "<----------------");
    console.log(aSchemaBrokerEntity, origEnt);

    aSchemaBrokerEntity.done();

    console.log(aSchemaBrokerEntity);
  });
});

