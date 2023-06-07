import { expect } from "chai";
import { Collector } from "../../src/bootstrap/collector.js";
import { Addon } from "../../src/configuration/addon-type.js";
import { Importer } from "../../src/bootstrap/importer.js";
import { FunctionsContext } from "../../src/entities/functions-context.js";
import { SystemContext } from "../../src/entities/system-context.js";
import { BrokerFactory } from "../../src/broker/entity-broker.js";

describe("Addons test", () => {
  it("COLLECTOR - Pulls local files", async () => {
    // Assumes you've also downloaded the http-json-meta-protocol repo in the same directory
    const localAddonConfig : Addon = {
      source: "../../http-json-meta-protocol/",
      collectStrategy: "file",
      identifier: "http-local",
      configuration: {
        "port": 3333,
        "host": "0.0.0.0",
        "routes": [
          {
            "businessOperation": "hello",
            "route": "/",
            "method": "GET",
            "inputMapConfiguration": [],
            "resultMapConfiguration": {
              statusCode: 200,
              headers: [],
              body: { "correct": "yeah" },
            },
          },
        ],
      },
    };
    const collector = new Collector([localAddonConfig]);
    const result = await collector.collectAddons();

    expect(result["http-local"]).to.not.be.undefined;

    const importAddons = await Importer.importAddons(result);
    const functionsContext = new FunctionsContext();
    const systemContext = new SystemContext({
      schemas: [],
      businessOperations: [],
      envs: [],
      name: "test",
      addons: [],
      version: "1.0.0",
    });

    const imported = importAddons.get("http-local");

    const functionBroker = functionsContext.createBroker(imported.metaFile.permissions);
    functionsContext.systemBroker.bopFunctions.addBopCall("hello", () => { console.log("YEEHAW");}, {});

    const systemBroker = systemContext.createBroker(imported.metaFile.permissions);
    const finalBroker = BrokerFactory.joinBrokers(functionBroker, systemBroker);

    importAddons.get("http-local").main.configure(finalBroker, localAddonConfig.configuration);
    await importAddons.get("http-local").main.boot(finalBroker);

    const awaiter = new Promise((res) => {
      setTimeout(() => {
        res("aa");
      }, 15000);
    });

    await awaiter;
  });
});
