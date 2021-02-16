/* eslint-disable max-lines-per-function */
require("module-alias/register");
import chai from "chai";
import { SchemaRoutesManager } from "@api/schemas/application/schema-routes-manager";
import { schemaFactory } from "@test/factories/schema-factory";
import axios from "axios";
import { InMemoryMongoClient } from "@test/doubles/in-memory-mongo-client";
import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import faker from "faker";
import { entityFactory } from "@test/factories/entity-factory";
import { entityToQuery } from "@test/factories/entity-to-query";

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
  let fakeClient : InMemoryMongoClient;
  let schemaHandler : SchemaRoutesManager;

  beforeEach(async () => {
    schema = schemaFactory({ routes: allRoutesEnabled });
    systemName = faker.name.jobType();
    entity = entityFactory(schema.format);
    fakeClient = new InMemoryMongoClient();
    schemaHandler = new SchemaRoutesManager(schema, fakeClient);

    await schemaHandler.initialize(systemName);
    await schemaHandler.router.listenOnPort(port);
  });

  afterEach(async () => {
    await schemaHandler.router?.shutdown();
  });

  it("Post method successfull", async () => {
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(response => {
        expect(response.data.message).to.be.equal("Inserted entity successfully");
        const foundKeys = Object.keys(fakeClient.db(systemName).collection(schema.name)["entities"][0]);
        const expectedKeys = Object.keys(entity);
        expectedKeys.push("_id");
        expect(foundKeys).to.be.deep.equal(expectedKeys);
      });
  });

  it("Query [Get] method successfull", async () => {
    const query = entityToQuery(entity);
    let entityId : string;
    const duplicateEntity = entity; //Will also be found on query
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, duplicateEntity);
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(response => { entityId = response.data.insertedId; });

    await axios.get(`http://localhost:${port}/${systemName}/${schema.name}?${query}`)
      .then(response => {
        expect(response.data.length).to.be.equal(2);
        const secondEntity = response.data.find(returnedEntity => returnedEntity._id === entityId);
        expect(secondEntity).not.to.be.undefined;
        const foundKeys = Object.keys(response.data[0]);
        const entityKeys = Object.keys(entity);
        entityKeys.push("_id");
        expect(foundKeys).to.be.deep.equal(entityKeys);
      });
  });

  it("Delete method successfull", async () => {
    const entities = fakeClient.db(systemName).collection(schema.name).entities;
    let entityId : string;
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(response => {
        entityId = response.data.insertedId;
      });

    expect(entities).not.to.be.empty;
    await axios.delete(`http://localhost:${port}/${systemName}/${schema.name}/${entityId}`);
    expect(entities).to.be.empty;
  });

  it("Put method successfull", async () => {
    let entityId : string;
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(response => {
        entityId = response.data.insertedId;
      });

    const newEntity = entityFactory(schema.format);
    await axios.put(`http://localhost:${port}/${systemName}/${schema.name}/${entityId}`, newEntity);
    const found = fakeClient.db(systemName).collection(schema.name).entities[0];

    expect(JSON.stringify(found)).to.be.equal(JSON.stringify(newEntity));
  });

  it("Patch method successfull", async () => {
    let entityId : string;
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(response => {
        entityId = response.data.insertedId;
      });

    const newEntity = entityFactory(schema.format);
    await axios.patch(`http://localhost:${port}/${systemName}/${schema.name}/${entityId}`, newEntity);
    const found = fakeClient.db(systemName).collection(schema.name).entities[0];
    expect(JSON.stringify(found)).to.be.equal(JSON.stringify(newEntity));
  });

  it("Get method successfull", async () => {
    let entityId : string;
    await axios.post(`http://localhost:${port}/${systemName}/${schema.name}`, entity)
      .then(response => {
        entityId = response.data.insertedId;
      });

    await axios.get(`http://localhost:${port}/${systemName}/${schema.name}/${entityId}`)
      .then(response => {
        const foundKeys = Object.keys(response.data);
        const expectedKeys = Object.keys(entity);
        expectedKeys.push("_id");
        expect(foundKeys).to.be.deep.equal(expectedKeys);
      });
  });
});


