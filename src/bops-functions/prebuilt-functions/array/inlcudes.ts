import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import assert from "assert";

export const arrayIncludesBopsFunction = (input : { array : unknown[]; searchedItem : unknown }) : unknown => {
  if (typeof input.searchedItem === "object") {
    const foundItem = input.array.find((value) => {
      try {
        assert.deepStrictEqual(value, input.searchedItem);
        return true;
      } catch {
        return false;
      }
    });

    return ({ result: foundItem !== undefined });
  }

  return ({ result: input.array.includes(input.searchedItem) });
};

export const arrayIncludesBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayIncludesBopsFunction",
  version: "1.0.0",
  description: "Verifies if the array contains an Item",
  outputData: [
    {
      type: "boolean",
      name: "result",
      branch: "result",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
  ],
  inputParameters: [
    { name: "array", type: "array.any", required: true },
    { name: "searchedItem", type: "any", required: true },
  ],
  customTypes: [],
};
