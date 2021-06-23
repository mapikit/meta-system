import { BopsEngine } from "@api/bops-functions/bops-engine/bops-engine";
import { MappedFunctions, ModuleManager } from "@api/bops-functions/bops-engine/modules-manager";
import { FunctionsInstaller } from "@api/bops-functions/installation/functions-installer";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { expect } from "chai";
import { MongoClient } from "mongodb";
import { testSystem } from "@test/bops-functions/bops-engine/test-data/test-system";
import { SchemasType } from "@api/configuration/domain/schemas-type";
import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { TTLExceededError } from "@api/bops-functions/bops-engine/engine-errors/execution-time-exceeded";
import { ResolvedConstants, StaticSystemInfo } from "@api/bops-functions/bops-engine/static-info-validation";
import { BusinessOperations } from "@api/configuration/domain/business-operations-type";


interface EngineInput {
  MappedFunctions : MappedFunctions;
  MappedConstants : Record<string, ResolvedConstants>;
  BopsConfigs : BusinessOperations[];
}

let bopsEnginePrerequisites : EngineInput;
let fakeMongo : MongoClient;
const maxExecutionTime = 100;

const setupBopsEngineRequisites = async () : Promise<EngineInput> => {
  const functionsFolder = "test-functions";
  const installationHandler = new FunctionsInstaller(functionsFolder);
  const fileSystem = new FunctionFileSystem(process.cwd(), functionsFolder, "meta-function.json");

  const schemasManager = new SchemasManager(testSystem.name, fakeMongo);
  await schemasManager.addSystemSchemas(testSystem.schemas as SchemasType[]);
  const moduleManager = new ModuleManager({
    SchemasManager: schemasManager,
    FunctionsInstaller: installationHandler,
    FunctionsFileSystem: fileSystem,
  });

  const bopsEngineInputOptions = {
    MappedFunctions: await moduleManager.resolveSystemModules(testSystem),
    MappedConstants: StaticSystemInfo.validateSystemStaticInfo(testSystem),
    BopsConfigs: testSystem.businessOperations,
  };
  return bopsEngineInputOptions;
};

describe.only("Bops Engine Testing", () => {
  before(async () => {
    fakeMongo = await createFakeMongo();
    bopsEnginePrerequisites = await setupBopsEngineRequisites();
  });

  afterEach(async () => {
    fakeMongo = await createFakeMongo();
  });

  it("Test of schema functions", async () => {
    const schemaFunctionsBop = testSystem.businessOperations.find(bop => bop.name === "schema-functions");
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stich(schemaFunctionsBop);
    const res = await stitched();

    console.log(res);
  });
});
