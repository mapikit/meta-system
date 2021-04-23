import { BopsEngine } from "@api/bops-functions/bops-engine/bops-engine";
import { ModuleManager } from "@api/bops-functions/bops-engine/modules-manager";
import { FunctionsInstaller } from "@api/bops-functions/installation/functions-installer";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { expect } from "chai";
import { MongoClient } from "mongodb";
import { testSystem } from "@test/bops-functions/bops-engine/test-data/test-system";
import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { TTLExceededError } from "@api/bops-functions/bops-engine/engine-errors/execution-time-exceeded";
import { performance } from "perf_hooks";
import { ConstantManagement } from "@api/bops-functions/bops-engine/constant-validation";

describe("Bops Engine Testing", () => {
  let fakeMongo : MongoClient;
  const functionsFolder = "test-functions";
  const installationHandler = new FunctionsInstaller(functionsFolder);
  const fileSystem = new FunctionFileSystem(process.cwd(), functionsFolder, "meta-function.json");
  const maxExecutionTime = 100;

  const setupBopsEngine = async () : Promise<BopsEngine> => {
    const schemasManager = new SchemasManager(testSystem.name, fakeMongo);
    await schemasManager.addSystemSchemas(testSystem.schemas as SchemasType[]);
    const moduleManager = new ModuleManager({
      SchemaManager: schemasManager,
      FunctionsInstaller: installationHandler,
      FunctionsFileSystem: fileSystem,
    });

    const bopsEngine = new BopsEngine({
      MappedConstants: ConstantManagement.validateAllSystemConstants(testSystem),
      MappedFunctions: await moduleManager.resolveSystemModules(testSystem),
      MaxExecutionTime: maxExecutionTime,
    });
    return bopsEngine;
  };

  let flowResolver : BopsEngine;
  before(async () => {
    fakeMongo = await createFakeMongo();
    flowResolver = await setupBopsEngine();
  });

  afterEach(async () => {
    fakeMongo = await createFakeMongo();
  });

  it("Test of schema functions", async () => {
    const schemaFunctionsBop = testSystem.businessOperations.find(bop => bop.name === "schema-functions");
    const flow = await flowResolver.startFlow({ bopConfig: schemaFunctionsBop });

    const secondInsertionId = flow.results[2]["createdEntity"]["_id"];
    expect(flow.results[3]["found"]).to.be.true;
    expect(flow.results[3]["entity"]["_id"]).to.be.deep.equal(secondInsertionId);
    expect(flow.results[4]["updatedEntity"]["_id"]).to.be.deep.equal(secondInsertionId);
    expect(flow.results[6]["entities"]).to.be.empty;
  });

  it("Test of mapikit provided functions", async () => {
    const providedFunctionsBop = testSystem.businessOperations.find(bop => bop.name === "prebuilt-functions");
    const flow = await flowResolver.startFlow({ bopConfig: providedFunctionsBop });

    expect(flow.results[2]["result"]).to.be.equal(5025);
    expect(flow.results[6]["result"]).to.be.equal(6);
    expect(flow.results[10]["result"]).to.be.equal(5093);
  });

  it("Test of external functions", async () => {
    const externalFunctionsBop = testSystem.businessOperations.find(bop => bop.name === "external-functions");
    const flow = await flowResolver.startFlow({ bopConfig: externalFunctionsBop });

    expect(flow.results[1]["customGreetings"]).to.be.true;
    expect(flow.results[2]["customGreetings"]).to.be.true;
    expect(flow.results[3]["customGreetings"]).to.be.false;
  });

  it("Successfully tests mixed functions (schema, provided and external)", async () => {
    const mixedFunctionsBop = testSystem.businessOperations.find(bop => bop.name === "mixed-functions");
    const flow = await flowResolver.startFlow({ bopConfig: mixedFunctionsBop });

    expect(flow.results[5]["entity"]["year"]).to.be.equal(3);
    expect(flow.results[5]["entity"]["model"]).to.be.equal("Onix");
    expect(flow.results[4]["customGreetings"]).to.be.true;
  });

  it("Fails to execute flow - Timed Out", async () => {
    const timeoutBop = testSystem.businessOperations.find(bop => bop.name === "timeout");
    const startedAt = performance.now();
    const flow = await flowResolver.startFlow({ bopConfig: timeoutBop });
    const elapsedTime = performance.now() - startedAt;

    expect(elapsedTime).to.be.at.least(maxExecutionTime);
    expect(flow["results"]).to.be.undefined;
    expect(flow.executionError.errorName).to.be.equal(TTLExceededError.name);
    expect(flow.executionError.errorMessage).to.contain("Time limit exceeded");
  });

  it("Executes two internal BopEngines - One succeeds and Another Fails with TTLExpired", async () => {
    const bopception = testSystem.businessOperations.find(bop => bop.name === "bopception");
    const flow = await flowResolver.startFlow({ bopConfig: bopception });

    expect(flow.results).to.be.undefined;
    expect(flow.executionError.errorName).to.be.equal(TTLExceededError.name);
    expect(flow.executionError.errorMessage).to.contain("Time limit exceeded after");
    expect(flow.executionError.partialResults[1].results).not.to.be.undefined;
    expect(flow.executionError.partialResults[2]["customGreetings"]).to.be.true;
    expect(flow.executionError.partialResults[3].results).not.to.be.undefined;
    expect(flow.executionError.partialResults[4].executionError.errorName).to.be.equal(TTLExceededError.name);
    expect(flow.executionError.partialResults[5]).to.be.undefined;
  });
});
