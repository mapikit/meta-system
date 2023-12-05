import { nanoid } from "nanoid";
import { checkEntityDiff } from "../../src/configuration/diff/check-entity-diff.js";
import { DiffManager } from "../../src/configuration/diff/diff-manager.js";
import { expect } from "chai";
import { SystemSetup } from "../../src/bootstrap/system-setup.js";
import { importJsonAndParse } from "../../src/common/helpers/import-json-and-parse.js";
import { environmentStart } from "../../src/common/environment-start.js";
import constants from "../../src/common/constants.js";

describe("Configuration Diff Tests", () => {
  it("Diff checker gets all diffs", () => {
    const objectBefore = { removed: "rrr", modified: { value: false } };
    const objectAfter = { added: 2992, modified: "yes" };
    const identifier = nanoid();

    const diff = checkEntityDiff(
      identifier,
      "test",
      "schema",
      objectBefore,
      objectAfter,
    );

    const modifiedFieldDiff = {
      action: "modified",
      actorIdentifier: "test",
      targetEntityIdentifier: identifier,
      targetEntityType: "schema",
      targetPath: "modified",
      newEntityState: objectAfter,
      targetPathNewValue: "yes",
    };

    const removedFieldDiff = {
      action: "removed",
      actorIdentifier: "test",
      targetEntityIdentifier: identifier,
      targetEntityType: "schema",
      targetPath: "removed",
      newEntityState: objectAfter,
      targetPathNewValue: undefined,
    };

    const addedFieldDiff = {
      action: "added",
      actorIdentifier: "test",
      targetEntityIdentifier: identifier,
      targetEntityType: "schema",
      targetPath: "added",
      newEntityState: objectAfter,
      targetPathNewValue: 2992,
    };

    expect(diff).to.deep.include(modifiedFieldDiff);
    expect(diff).to.deep.include(removedFieldDiff);
    expect(diff).to.deep.include(addedFieldDiff);
  });

  it("Diff Manager Stores diffs", () => {
    const objectBefore = { removed: "rrr", modified: { value: false } };
    const objectAfter = { added: 2992, modified: "yes" };
    const identifier = nanoid();

    const diffs = checkEntityDiff(
      identifier,
      "test",
      "schema",
      objectBefore,
      objectAfter,
    );

    const manager = new DiffManager();

    manager.addManyDiffsFromCheck(diffs);

    expect(diffs.map(manager.toDiffWithHash)).to.be.deep.equal(manager.diffs);
  });

  it("Diff Manager checkpoints differences", () => {
    const objectBefore = { removed: "rrr", modified: { value: false } };
    const objectAfter = { added: 2992, modified: "yes" };
    const identifier = nanoid();
    const firstActorIdentifier = nanoid();
    const secondActorIdentifier = nanoid();

    const firstDiffs = checkEntityDiff(
      identifier,
      firstActorIdentifier,
      "schema",
      objectBefore,
      objectAfter,
    );

    const secondDiffs = checkEntityDiff(
      identifier,
      secondActorIdentifier,
      "schema",
      objectBefore,
      objectAfter,
    );
    const manager = new DiffManager();

    manager.addManyDiffsFromCheck(firstDiffs);
    manager.addCheckpoint(firstActorIdentifier);
    manager.addManyDiffsFromCheck(secondDiffs);
    manager.addCheckpoint(secondActorIdentifier);

    expect([].concat(firstDiffs,secondDiffs).map(manager.toDiffWithHash)).to.be.deep.equal(manager.diffs);
    expect(manager.checkpoints.has(firstActorIdentifier)).to.be.true;
    expect(manager.checkpoints.has(secondActorIdentifier)).to.be.true;
    expect(manager.getDiffsUpToCheckpoint(firstActorIdentifier)).to.be.deep
      .equal(firstDiffs.map(manager.toDiffWithHash));
  });

  it("Adds diffs During Setup", async () => {
    await environmentStart("./test", true);
    // eslint-disable-next-line max-len
    const configurationExample = await importJsonAndParse("./test/configuration/test-data/configuration-example.json");
    const systemSetup = new SystemSetup(configurationExample, { logLevel: "debug" });
    await systemSetup.prepare();

    expect(systemSetup.diffManager.diffs.length).to.be.greaterThan(0);
  });

  it("Queries Diffs by checkpoint", async () => {
    await environmentStart("./test", true);
    // eslint-disable-next-line max-len
    const configurationExample = await importJsonAndParse("./test/configuration/test-data/configuration-example.json");
    const systemSetup = new SystemSetup(configurationExample, { logLevel: "debug" });
    await systemSetup.prepare();

    const diffManager = systemSetup.diffManager;
    const diffManagerQuery = diffManager.queryDiffs({ "checkpoint": "http-local" });
    const expectedActors = [constants.RUNTIME_ENGINE_IDENTIFIER, "http-local"];
    const queriedDiffActors = diffManagerQuery.map((diff) => diff.actorIdentifier).reduce((accumulator, curr) => {
      if (accumulator.includes(curr)) return accumulator;
      accumulator.push(curr);
      return accumulator;
    }, []);

    const allActors = diffManager.diffs.map((d) => d.actorIdentifier).reduce((accumulator, curr) => {
      if (accumulator.includes(curr)) return accumulator;
      accumulator.push(curr);
      return accumulator;
    }, []);

    expect(queriedDiffActors).to.be.deep.equal(expectedActors);
    expect(allActors).to.not.be.deep.equal(queriedDiffActors);
  });

  it("Queries Diffs by entity", async () => {
    await environmentStart("./test", true);
    // eslint-disable-next-line max-len
    const configurationExample = await importJsonAndParse("./test/configuration/test-data/configuration-example.json");
    const systemSetup = new SystemSetup(configurationExample, { logLevel: "debug" });
    await systemSetup.prepare();

    const diffManager = systemSetup.diffManager;
    const diffManagerQueried = diffManager
      .queryDiffs({ "entity": { "entityType": "schema", "identifier": "purchase" } });

    expect(diffManagerQueried.every((diff) => diff.targetEntityIdentifier === "purchase")).to.equal(true);
  });
});
