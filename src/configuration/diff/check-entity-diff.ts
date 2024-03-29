import { detailedDiff } from "deep-object-diff";
import { flatten } from "flat";
import { ConfigurationDiff } from "./configuration-diff-type.js";

// eslint-disable-next-line max-lines-per-function
export const checkEntityDiff = (
  identifier : string,
  actorIdentifier : string,
  entityType : ConfigurationDiff["targetEntityType"],
  before : Record<string, unknown>,
  after : Record<string, unknown>,
// eslint-disable-next-line max-params
) : ConfigurationDiff[] => {
  const computedDiff = detailedDiff(before, after);
  const addedValues = Object.entries(flatten(computedDiff.added));
  const removedValues = Object.entries(flatten(computedDiff.deleted));
  const updatedValues = Object.entries(flatten(computedDiff.updated));

  const result = [].concat(
    addedValues.map((entry) => buildDiff(identifier, actorIdentifier, entityType, entry[0], "added", entry[1], after)),
    updatedValues.map((entry) => buildDiff(
      identifier, actorIdentifier, entityType, entry[0], "modified", entry[1], after)),
    removedValues.map((entry) => buildDiff(
      identifier, actorIdentifier, entityType, entry[0], "removed", entry[1], after)),
  );

  return result;
};

// eslint-disable-next-line max-lines-per-function
const buildDiff = (
  identifier : string,
  actor : string,
  type : ConfigurationDiff["targetEntityType"],
  path : string,
  action : ConfigurationDiff["action"],
  value : unknown,
  entityValue : unknown,
// eslint-disable-next-line max-params
) : ConfigurationDiff => ({
  action,
  actorIdentifier: actor,
  targetEntityIdentifier: identifier,
  targetEntityType: type,
  targetPath: path,
  newEntityState: entityValue,
  targetPathNewValue: value,
});


