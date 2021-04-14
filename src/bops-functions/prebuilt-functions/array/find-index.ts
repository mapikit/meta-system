import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import assert from "assert";

// eslint-disable-next-line max-lines-per-function
export const arrayFindIndexBopsFunction = (input : { array : unknown[]; searchedItem : unknown }) : unknown => {
  if (typeof input.searchedItem === "object") {
    const foundIndex = input.array.findIndex((value) => {
      try {
        assert.deepStrictEqual(value, input.searchedItem);
        return true;
      } catch {
        return false;
      }
    });

    if (foundIndex >= 0) {
      return ({ index: foundIndex });
    }

    return ({ notFoundMessage: "No item matchs in the given array" });
  }

  const result = input.array.findIndex((value) => input.searchedItem === value);

  if (result >= 0) {
    return ({ index: result });
  }

  return ({ notFoundMessage: "No item matchs in the given array" });
};

export const arrayFindIndexBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayFindIndexBopsFunction",
  version: "1.0.0",
  description: "Find the index of a given item in the array",
  outputData: [
    {
      type: "any",
      name: "index",
      branch: "found",
    },
    {
      type: "string",
      name: "notFoundMessage",
      branch: "notFound",
    },
  ],
  outputBranches: [
    {
      branchName: "found",
    },
    {
      branchName: "notFound",
    },
  ],
  inputParameters: [
    { name: "array", type: "array.any", required: true },
    { name: "searchedItem", type: "any", required: true },
  ],
  customTypes: [],
};
