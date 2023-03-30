import { BopsEngine } from "../../../src/bops-functions/bops-engine/bops-engine.js";
import { ModuleManager } from "../../../src/bops-functions/bops-engine/modules-manager.js";
import { SchemasManager } from "../../../src/schemas/application/schemas-manager.js";
import { createFakeMongo } from "../../doubles/mongo-server";
import { expect } from "chai";
import { testSystem } from "./test-data/test-system";
import { ResolvedConstants, StaticSystemInfo } from "../../../src/bops-functions/bops-engine/static-info-validation";
import { BusinessOperations } from "../../../src/configuration/business-operations/business-operations-type.js";
import { SchemaType } from "../../../src/configuration/schemas/schemas-type.js";
import { mapikitProvidedBop } from "./test-data/business-operations/prebuilt-bop";
import { schemaBop } from "./test-data/business-operations/schema-bop";
import { externalBop } from "./test-data/business-operations/external-bop";
import faker from "faker";
import { CheckBopsFunctionsDependencies }
  from "../../../src/configuration/business-operations/check-bops-functions-dependencies.js";
import { BusinessOperation } from "../../../src/configuration/business-operations/business-operation.js";
import internalFunctionManager from "../../../src/bops-functions/function-managers/internal-function-manager.js";
import { BopsManagerClass } from "../../../src/bops-functions/function-managers/bops-manager.js";
import { ConfigurationType } from "../../../src/configuration/configuration-type.js";
import { variableBop } from "./test-data/business-operations/variables-bop";
import { packageBop } from "./test-data/business-operations/package-bop";
import { purgeTestPackages, testExternalManager, testProtocolManager } from "../../test-managers";
import { Protocol } from "../../../src/configuration/protocols/protocols";
import { DBProtocolNewable } from "../../../src/bops-functions/function-managers/protocol-function-manager.js";

interface EngineInput {
  ModuleManager : ModuleManager;
  MappedConstants : Record<string, ResolvedConstants>;
  SystemConfig : ConfigurationType;
}

let bopsEnginePrerequisites : EngineInput;
let fakeMongoUri : string;
const maxExecutionTime = 100;

const setupBopsEngineRequisites = async (bop : BusinessOperations) : Promise<EngineInput> => {
  const bopsManager = new BopsManagerClass();

  const businessOperations = testSystem.businessOperations
    .map((plainBop) => { return new BusinessOperation(plainBop) ;});

  const bopsDependencies = new CheckBopsFunctionsDependencies(
    testSystem.schemas,
    businessOperations,
    new BusinessOperation(bop),
    testExternalManager,
    internalFunctionManager,
    testProtocolManager,
  ).bopsDependencies;

  for (const protocol of testSystem.protocols) {
    const config = { ...protocol.configuration };
    config["dbConnectionString"] = fakeMongoUri;
    await testProtocolManager.installProtocol(new Protocol(protocol));
    const newable = await testProtocolManager.getProtocolNewable(protocol.protocol) as DBProtocolNewable;
    const instance = new newable(config, testSystem.schemas as SchemaType[]);
    testProtocolManager.addProtocolInstance(instance, protocol.identifier);
  }

  const schemasManager = new SchemasManager(testSystem.name, testProtocolManager);
  await schemasManager.addSystemSchemas(testSystem.schemas as SchemaType[]);
  const moduleManager = new ModuleManager({
    SchemasManager: schemasManager,
    InternalFunctionManager: internalFunctionManager,
    ExternalFunctionManager: testExternalManager,
    protocolFunctionManager: testProtocolManager,
    BopsManager: bopsManager,
  });


  for (const externalDependency of bopsDependencies.external) {
    await testExternalManager.add(externalDependency.name, externalDependency.version, externalDependency.package);
  }

  const bopsEngineInputOptions : EngineInput = {
    ModuleManager: moduleManager,
    MappedConstants: StaticSystemInfo.validateSystemStaticInfo(testSystem),
    SystemConfig: testSystem,
  };

  return bopsEngineInputOptions;
};

describe("Bops Engine Testing", () => {
  beforeEach(async () => { fakeMongoUri = await createFakeMongo(); });
  afterEach(() => {
    testProtocolManager.flush();
  });

  after(purgeTestPackages);

  it("Test of prebuilt functions", async () => {
    bopsEnginePrerequisites = await setupBopsEngineRequisites(mapikitProvidedBop);
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stitch(mapikitProvidedBop, maxExecutionTime);
    const randomNumber = Math.round(Math.random()*10);
    const res = await stitched({ aNumber: randomNumber });

    expect(res["output"]).to.be.equal(Math.pow(3, randomNumber));
  });

  it("Test of schema BOps functions", async () => {
    bopsEnginePrerequisites = await setupBopsEngineRequisites(schemaBop);
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stitch(schemaBop, maxExecutionTime);
    const randomYear = Math.round(Math.random()*2100);
    const car = { model: "fakeModel", year: randomYear };
    const res = await stitched({ aCar: car });

    expect(res["output"]["affectedEntities"]).to.be.equal(1);
  });

  it("Test of external BOps functions", async () => {
    bopsEnginePrerequisites = await setupBopsEngineRequisites(externalBop);
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stitch(externalBop, maxExecutionTime);
    const randomName = faker.name.firstName();
    const res = await stitched({ myName: randomName });

    expect(res["wasGreeted"]).to.be.true;
    expect(res["greetings"]).to.be.equal("Hello " + randomName);
  });

  it("Test of variable capability", async () => {
    bopsEnginePrerequisites = await setupBopsEngineRequisites(variableBop);
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stitch(variableBop, maxExecutionTime);

    const randomNumber = Math.random()*1000;
    const result = await stitched({ aNumber: randomNumber, randomValue: { thisVar: "isAnObject" } });

    expect(result).not.to.be.undefined;
    expect(result.initialValue).to.be.equal(15);
    expect(result.functionOutput).to.be.equal(2);
    expect(result.newValue).to.be.equal(randomNumber);
    expect(result.randomItem).to.be.deep.equal({ thisVar: "isAnObject" });
  });

  it("Test package functions", async () => {
    bopsEnginePrerequisites = await setupBopsEngineRequisites(packageBop);
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stitch(packageBop, maxExecutionTime);

    const result1 = await stitched({ age: 50 });
    expect(result1["over18"]).to.be.true;

    const result2 = await stitched({ age: 12 });
    expect(result2["over18"]).to.be.false;
  });
});

