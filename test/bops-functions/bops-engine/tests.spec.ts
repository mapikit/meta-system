require("module-alias/register");
import { FlowResolver } from "@api/bops-functions/bops-engine/flow-resolver";
import { ModuleManager } from "@api/bops-functions/bops-engine/modules-manager";
import { FunctionsInstaller } from "@api/bops-functions/installation/functions-installer";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { expect } from "chai";
import { MongoClient } from "mongodb";
import { testSystem } from "@test/bops-functions/bops-engine/test-data/test-system";
import { validateConstants } from "@api/bops-functions/bops-engine/constant-validation";
import { BopsConstant, BusinessOperations } from "@api/configuration-de-serializer/domain/business-operations-type";
import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";

describe("Bops Engine Testing", () => {
  let fakeMongo : MongoClient;
  const functionsFolder = "test-functions";
  const installationHandler = new FunctionsInstaller(functionsFolder);
  const fileSystem = new FunctionFileSystem(process.cwd(), functionsFolder, "meta-function.json");

  const setupWithBop = async (bop : BusinessOperations) : Promise<FlowResolver> => {
    const schemasManager = new SchemasManager(testSystem.name, fakeMongo);
    await schemasManager.addSystemSchemas(testSystem.schemas as SchemasType[]);
    const moduleManager = new ModuleManager({
      SchemaManager: schemasManager,
      FunctionsInstaller: installationHandler,
      FunctionsFileSystem: fileSystem,
    });
    const flowHandler = new FlowResolver({
      mappedConstants: validateConstants(bop.constants as BopsConstant[]),
      mappedFunctions: await moduleManager.resolveModules(bop.configuration),
      bopConfig: bop.configuration,
    });
    return flowHandler;
  };

  beforeEach(async () => {
    fakeMongo = await createFakeMongo();
  });

  afterEach(async () => {
    await installationHandler.purgePackages();
    await fakeMongo.close();
  });

  it("Test of schema functions", async () => {
    const schemaFunctionsBop = testSystem.businessOperations.find(bop => bop.name === "schema-functions");
    const flowResolver = await setupWithBop(schemaFunctionsBop);
    const flow = await flowResolver.startFlow();

    const secondInsertionId = flow["results"].get(2)["createdEntity"]._id;
    expect(flow["results"].get(3)["found"]).to.be.true;
    expect(flow["results"].get(3)["entity"]._id).to.be.deep.equal(secondInsertionId);
    expect(flow["results"].get(4)["updatedEntity"]._id).to.be.deep.equal(secondInsertionId);
    expect(flow["results"].get(6)["entities"]).to.be.empty;
  });

  it("Test of mapikit provided functions", async () => {
    const providedFunctionsBop = testSystem.businessOperations.find(bop => bop.name === "prebuilt-functions");
    const flowResolver = await setupWithBop(providedFunctionsBop);
    const flow = await flowResolver.startFlow();

    expect(flow["results"].get(2)["result"]).to.be.equal(5025);
    expect(flow["results"].get(6)["result"]).to.be.equal(6);
    expect(flow["results"].get(10)["result"]).to.be.equal(5093);
  });

  it("Test of external functions", async () => {
    const externalFunctionsBop = testSystem.businessOperations.find(bop => bop.name === "external-functions");
    const flowResolver = await setupWithBop(externalFunctionsBop);
    const flow = await flowResolver.startFlow();

    expect(flow["results"].get(1)["customGreetings"]).to.be.true;
    expect(flow["results"].get(2)["customGreetings"]).to.be.true;
    expect(flow["results"].get(3)["customGreetings"]).to.be.false;
  });

  it("Successfully tests mixed functions (schema, provided and external)", async () => {
    const externalFunctionsBop = testSystem.businessOperations.find(bop => bop.name === "mixed-functions");
    const flowResolver = await setupWithBop(externalFunctionsBop);
    const flow = await flowResolver.startFlow();

    expect(flow["results"].get(5)["entity"]["year"]).to.be.equal(3);
    expect(flow["results"].get(5)["entity"]["model"]).to.be.equal("Onix");
    expect(flow["results"].get(4)["customGreetings"]).to.be.true;
  });
});
