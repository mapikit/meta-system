/* eslint-disable max-lines-per-function */
require("module-alias/register");
import chai from "chai";
import { ExtendedHttpMethods, SchemaHandler } from "@api/common/schema-handler";
import { schemaFactory } from "@test/factories/schema-factory";
import axios, { AxiosResponse } from "axios";
import { MockMongoClient } from "@test/doubles/mongo-client";
import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import faker from "faker";

const expect = chai.expect;

const allRoutesEnabled : SchemasType["routes"] = {
  getMethodEnabled: true,
  postMethodEnabled: true,
  putMethodEnabled: true,
  patchMethodEnabled: true,
  deleteMethodEnabled: true,
  queryParamsGetEnabled: true,
};

describe("Schema Handler Test", () => {
  const port = faker.random.number({ min: 8001, max: 8800, precision: 1 });
  let schema = schemaFactory({ routes: allRoutesEnabled });
  let systemName : string;
  let fakeClient : MockMongoClient;
  let schemaHandler : SchemaHandler;

  beforeEach(() => {
    schema = schemaFactory({ routes: allRoutesEnabled });
    systemName = faker.name.jobType();
    fakeClient = new MockMongoClient();
    schemaHandler = new SchemaHandler(schema, fakeClient);

  });

  afterEach(async () => {
    await schemaHandler.router?.shutdown();
  });

  it("Successfully initiates schema routes", async () => {
    await schemaHandler.initialize(systemName);
    await schemaHandler.router.listenOnPort(port);
    await testMethods(schema.routes, `http://localhost:${port}/${systemName}/${schema.name}`);
  });

  it("Fails to initiate routes - Invalid system name", async () => {
    const invalidSystemName = "No spaces allowed";
    await schemaHandler.initialize(invalidSystemName)
      .then(() => {
        expect(false).to.be.true;
      })
      .catch(error => {
        expect(error.name).to.be.equal("RouteFormatError");
      });
  });

  it("Fails to initiate routes - Invalid schema name", async () => {
    const invalidSchema = schemaFactory({ name : "some-symbols-are-prohibited$%$!@" });
    schemaHandler = new SchemaHandler(invalidSchema, fakeClient);
    await schemaHandler.initialize(systemName)
      .then(() => {
        expect(false).to.be.true;
      })
      .catch(error => {
        expect(error.name).to.be.equal("RouteFormatError");
      });
  });
});

async function testMethods (methods : SchemasType["routes"], baseRoute : string) : Promise<void> {
  const enabledMethods = new Array<ExtendedHttpMethods>(
    methods.deleteMethodEnabled ? "delete" : null,
    methods.patchMethodEnabled ? "patch" : null,
    methods.postMethodEnabled ? "post" : null,
    methods.putMethodEnabled ? "put" : null,
    methods.getMethodEnabled ? "get" : null,
    methods.queryParamsGetEnabled ? "query" : null,
  ).filter(value => value !== null);

  const idlessRoutes : ExtendedHttpMethods[] = ["query", "post"];
  for(const method of enabledMethods) {
    if(idlessRoutes.includes(method)) {
      if(method == "post") {
        await axios.post(`${baseRoute}`).then((response : AxiosResponse) => {
          expect(response.status).to.be.equal(200);
        });
      }
      else if(method == "query") {
        await axios.get(`${baseRoute}?fakeProperty=fake`).then((response : AxiosResponse) => {
          expect(response.status).to.be.equal(200);
        });
      }
    }
    else {
      await axios[method](`${baseRoute}/fakeId`).then((response : AxiosResponse) => {
        expect(response.status).to.be.equal(200);
      });
    }
  }
};
