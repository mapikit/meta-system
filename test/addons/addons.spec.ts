import { expect } from "chai";
import { Collector } from "../../src/bootstrap/collector.js";
import { Addon } from "../../src/configuration/addon-type.js";
import { Importer } from "../../src/bootstrap/importer.js";

describe("Addons test", () => {
  it.only("COLLECTOR - Pulls local files", async () => {
    // Assumes you've also downloaded the http-meta-protocol repo in the same directory
    const localAddonConfig : Addon = {
      source: "../../http-json-meta-protocol/",
      collectStrategy: "file",
      identifier: "http-local",
      configuration: {},
    };
    const collector = new Collector([localAddonConfig]);
    const result = await collector.collectAddons();

    expect(result["http-local"]).to.not.be.undefined;

    const importAddons = await Importer.importAddons(result);
    console.log(importAddons);
  });
});
