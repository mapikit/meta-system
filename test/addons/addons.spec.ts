import { expect } from "chai";
import { Collector } from "../../src/bootstrap/collector.js";
import { Addon } from "../../src/configuration/addon-type.js";
import { FunctionsContext } from "../../src/entities/functions-context.js";
import { SystemContext } from "../../src/entities/system-context.js";
import { BrokerFactory } from "../../src/broker/entity-broker.js";
import { loggerSingleton } from "../../src/entities/singletons/logger.js";
import { MetaEntity } from "../../src/entities/meta-entity.js";
import constants from "../../src/common/constants.js";
import { LoggerClass } from "../../src/common/logger/logger.js";
import { LoggerType } from "../../src/common/logger/logger-types.js";
import { DiffManager } from "../../src/configuration/diff/diff-manager.js";
import { environmentStart } from "../../src/common/environment-start.js";
import { createFakeMongo } from "../doubles/mongo-server.js";

const replaceLogger = async () : Promise<void> => {
  const replacerLogger = new LoggerClass().initialize("debug") as unknown as LoggerType & LoggerClass;
  const loggerMetaEntity = new MetaEntity(
    constants.ENGINE_OWNER, { identifier: "default-logger", ...(await replacerLogger) });
  loggerSingleton[0] = loggerMetaEntity;
};

describe.only("Addons test", () => {
  let memoryMongo : string;
  before(async () => {
    memoryMongo = await createFakeMongo();
    await environmentStart("./test", true);
  });

  it("COLLECTOR - Pulls local files", async () => {
    // Assumes you've also downloaded the http-json-meta-protocol repo in the same directory
    const localAddonConfig : Addon = {
      source: "../mongo-db-protocol/",
      collectStrategy: "file",
      identifier: "http-local",
      configuration: {
        "databaseName": "john",
        "dbConnectionString": memoryMongo,
      },
    };
    const collector = new Collector(
      { runtimeEnv: "node" }, { addons: [localAddonConfig], "name": "test", "version": "0.0.1" },
    );
    const result = await collector.collectAddons();

    const imported = result.get("http-local");

    expect(imported).to.not.be.undefined;

    const diffManager = new DiffManager();
    const functionsContext = new FunctionsContext(diffManager);
    const systemContext = new SystemContext({
      schemas: [{
        identifier: "test",
        format: { prop: { type: "string" } },
        name: "test",
      }],
      businessOperations: [],
      envs: [],
      name: "test",
      addons: [],
      version: "1.0.0",
    }, diffManager);

    const functionBroker = functionsContext.createBroker(imported.metaFile.permissions, localAddonConfig.identifier);
    functionsContext.systemBroker.bopFunctions.addBopCall("hello", () => { console.log("YEEHAW");}, {});

    const systemBroker = systemContext.createBroker(imported.metaFile.permissions, localAddonConfig.identifier);
    const finalBroker = BrokerFactory.joinBrokers(functionBroker, systemBroker);
    await replaceLogger();

    const configResult = await imported.main
      .configure(finalBroker, localAddonConfig.configuration);
    await imported.main
      .boot(finalBroker, configResult);

    // I'm aware this is testing external library
    // Due to time constraints this will be accepted
    const testSchema = systemContext.systemBroker.schemas.getSchema("test");
    expect(testSchema.format._id).to.be.deep.equal({ type: "string", required: true });
  });
});
