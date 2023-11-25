import { nanoid } from "nanoid";
import { checkEntityDiff } from "../../src/configuration/diff/check-entity-diff.js";
import { DiffManager } from "../../src/configuration/diff/diff-manager.js";
import { expect } from "chai";
import { SystemSetup } from "../../src/bootstrap/system-setup.js";
import { importJsonAndParse } from "../../src/common/helpers/import-json-and-parse.js";
import { environmentStart } from "../../src/common/environment-start.js";

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

    expect(diffs).to.be.deep.equal(manager.diffs);
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

    expect([].concat(firstDiffs,secondDiffs)).to.be.deep.equal(manager.diffs);
    expect(manager.checkpoints.has(firstActorIdentifier)).to.be.true;
    expect(manager.checkpoints.has(secondActorIdentifier)).to.be.true;
    expect(manager.getDiffsUpToCheckpoint(firstActorIdentifier)).to.be.deep.equal(firstDiffs);
  });

  it("Adds diffs During Setup", async () => {
    await environmentStart("./test", true);
    // eslint-disable-next-line max-len
    const configurationExample = await importJsonAndParse("./test/configuration/test-data/configuration-example.json");
    const systemSetup = new SystemSetup(configurationExample, { logLevel: "debug" });
    await systemSetup.prepare();
  });
});
