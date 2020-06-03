require("module-alias/register");
import chai from "chai";
import { EntityContext } from "@api/entity/domain/contexts/entity-context";
import { EventManager } from "birbs";
import { mockManager } from "@test/doubles/mock-manager";
import { InMemoryMongoRepository } from "@test/doubles/in-memory-mongo-repository";
import { entityInsertionRequestFactory } from "@test/factories/requests/entity-insertion";
import { InsertEntity } from "@api/entity/domain/procedures/insert-entity";
import { entityFactory } from "@test/factories/entity-factory";
import { tokenClientFactory } from "@test/factories/token-client-factory";
import { schemaFactory } from "@test/factories/schema-factory";
const expect = chai.expect;

describe("Insert Entity Test", () => {
  let entityContext : EntityContext;
  let manager : EventManager;
  let mongoRepository : InMemoryMongoRepository;

  beforeEach(async () => {
    manager = mockManager();
    mongoRepository = new InMemoryMongoRepository();
    await mongoRepository.initialize();

    entityContext = new EntityContext(
      {
        EntityManager: manager,
      });
  });

  it("Successfully inserts entity", async () => {
    const identifier = Symbol("EntityTest");
    const entity = entityFactory({
      "Station Name": "This is a string, indeed",
      Premium : true,
    });

    const schema = schemaFactory({
      schema : [
        {
          fieldName : "Station Name",
          nullable: false,
          readonly: false,
          fieldType : "string",
        },
        {
          fieldName : "Premium",
          nullable: false,
          readonly: false,
          fieldType : "boolean",
        },
      ],
    });

    const insertEntityRequest = entityInsertionRequestFactory({
      schema: schema,
      entity: entity,
    });

    const authorizedClient = tokenClientFactory({ clientId: schema.clientId });

    const insertEntityProcedure = new InsertEntity({
      MongoRepository: mongoRepository,
    });

    await mongoRepository.createDatabase(authorizedClient.clientName);
    await mongoRepository.checkoutDatabase(authorizedClient.clientName);
    await mongoRepository.createCollection(insertEntityRequest.schema.schemaId);

    entityContext.setContextState(authorizedClient);
    await insertEntityProcedure.execute(entityContext, {
      payload: insertEntityRequest,
      identifier,
    });
    const foundEntities = await mongoRepository.getEntities();
    expect(Object.keys(foundEntities[0])).to.contain("Station Name");
    expect(Object.keys(foundEntities[0])).to.contain("Premium");
  });
});
