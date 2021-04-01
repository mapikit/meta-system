/* eslint-disable max-lines-per-function */
require("module-alias/register");
import chai from "chai";
import { SchemaRoutesManager } from "@api/schemas/application/schema-routes-manager";
import { schemaFactory } from "@test/factories/schema-factory";
import axios from "axios";
import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import faker from "faker";
import { entityFactory } from "@test/factories/entity-factory";
import { entityToQuery } from "@test/factories/entity-to-query";
import { MongoClient } from "mongodb";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { MetaRepository } from "@api/entity/domain/meta-repository";

const expect = chai.expect;

const allRoutesEnabled : SchemasType["routes"] = {
  getMethodEnabled: true,
  postMethodEnabled: true,
  putMethodEnabled: true,
  patchMethodEnabled: true,
  deleteMethodEnabled: true,
  queryParamsGetEnabled: true,
};

describe("Schema Handler Methods Test", () => {
  const port = faker.random.number({ min: 8001, max: 8800, precision: 1 });
  let schema = schemaFactory({ routes: allRoutesEnabled });
  let systemName : string;
  let entity : object;
  let fakeClient : MongoClient;
  let schemaHandler : SchemaRoutesManager;

  beforeEach(async () => {
    schema = schemaFactory({ routes: allRoutesEnabled });
    systemName = faker.name.jobType();
    entity = entityFactory(schema.format);
    fakeClient = await createFakeMongo();
    schemaHandler = new SchemaRoutesManager(schema, new MetaRepository(fakeClient));

    await schemaHandler.initialize(systemName);
    await schemaHandler.router.listenOnPort(port);
  });

  afterEach(async () => {
    await schemaHandler.router?.shutdown();
  });

  it("Post method successfull", async () => {
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(async response => {
        expect(response.data.message).to.be.equal("Inserted entity successfully");
        const foundEntity = await fakeClient.db(systemName).collection(schema.name).find().next();
        delete foundEntity._id;
        datesToString(entity);
        expect(foundEntity).to.be.deep.equal(entity);
      });
  });

  it("Query [Get] method successfull", async () => {
    const query = entityToQuery(entity);
    const duplicateEntity = entity; //Will also be found on query
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .catch(() => { chai.assert.fail("Failed on first entity insertion"); });

    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, duplicateEntity)
      .catch(() => { chai.assert.fail("Failed on second entity insertion"); });

    await axios.get(`http://localhost:${port}/${systemName}/${schema.name}?${query}`)
      .then(async response => {
        expect(response.data.length).to.be.equal(2);

        const entitiesFound = response.data;
        entitiesFound.forEach(ent => { delete ent._id; });
        datesToString(entity);
        expect(entitiesFound[0]).to.be.deep.equal(entity);
        expect(entitiesFound[1]).to.be.deep.equal(entity);
      });
  });

  it("Delete method successfull", async () => {
    let entityId : string;
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(async response => {
        entityId = response.data.insertedId;
        const entitiesAfterInsertion = await fakeClient.db(systemName).collection(schema.name).find().toArray();
        expect(entitiesAfterInsertion).not.to.be.empty;
      });

    await axios.delete(`http://localhost:${port}/${systemName}/${schema.name}/${entityId}`).then(async () => {
      const entitiesAfterDeletion = await fakeClient.db(systemName).collection(schema.name).find().toArray();
      expect(entitiesAfterDeletion).to.be.empty;
    });
  });

  it("Put method successfull", async () => {
    let entityId : string;
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(response => {
        entityId = response.data.insertedId;
      });

    const newEntity = entityFactory(schema.format);
    await axios.put(`http://localhost:${port}/${systemName}/${schema.name}/${entityId}`, newEntity);
    const found = await fakeClient.db(systemName).collection(schema.name).find().next();
    delete found._id;
    datesToString(newEntity);
    expect(found).to.be.deep.equal(newEntity);
  });

  it("Patch method successfull", async () => {
    let entityId : string;
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(response => {
        entityId = response.data.insertedId;
      });

    const newEntity = entityFactory(schema.format);
    await axios.patch(`http://localhost:${port}/${systemName}/${schema.name}/${entityId}`, newEntity)
      .then(async () => {
        const found = await fakeClient.db(systemName).collection(schema.name).find().next();
        delete found._id;
        datesToString(found);
        datesToString(newEntity);
        expect(found).to.be.deep.equal(newEntity);
      });
  });

  it("Get method successfull", async () => {
    let entityId : string;
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(response => {
        entityId = response.data.insertedId;
      });

    await axios.get(`http://localhost:${port}/${systemName}/${schema.name}/${entityId}`)
      .then(async response => {
        delete response.data._id;
        datesToString(entity);
        expect(response.data).to.be.deep.equal(entity);
      });
  });
});


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function datesToString (entity : Record<string, any>) : void {
  for(const key in entity) {
    if(entity[key] instanceof Object) {
      datesToString(entity[key]);
    }
    if(entity[key] instanceof Date) {
      entity[key] = entity[key].toISOString();
    }
  }
}
