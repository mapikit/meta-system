import { detailedDiff } from "deep-object-diff";
import { flatten } from "flat";
import { ConfigurationDiff } from "./configuration-diff-type.js";

// eslint-disable-next-line max-lines-per-function
export const checkEntityDiff = (
  identifier : string,
  actor : string,
  entityType : ConfigurationDiff["target"]["entity"],
  before : Record<string, unknown>,
  after : Record<string, unknown>,
// eslint-disable-next-line max-params
) : ConfigurationDiff[] => {
  const computedDiff = detailedDiff(before, after);
  const addedValues = Object.entries(flatten(computedDiff.added));
  const removedValues = Object.entries(flatten(computedDiff.deleted));
  const updatedValues = Object.entries(flatten(computedDiff.updated));

  const result = [].concat(
    addedValues.forEach((entry) => buildDiff(identifier, actor, entityType, entry[0], "added", entry[1])),
    removedValues.forEach((entry) => buildDiff(identifier, actor, entityType, entry[0], "removed", entry[1])),
    updatedValues.forEach((entry) => buildDiff(identifier, actor, entityType, entry[0], "modified", entry[1])),
  );

  return result;
};

// eslint-disable-next-line max-lines-per-function
const buildDiff = (
  identifier : string,
  actor : string,
  type : ConfigurationDiff["target"]["entity"],
  path : string,
  action : ConfigurationDiff["action"],
  value : unknown,
// eslint-disable-next-line max-params
) : ConfigurationDiff => {
  return ({
    action,
    actor,
    target: {
      entity: type,
      path,
      identifier,
    },
    finalValue: value,
  });
};

