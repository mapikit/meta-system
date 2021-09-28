import { InternalMetaFunction } from "../../internal-meta-function";
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
  functionName: "includes",
  version: "1.0.0",
  description: "Verifies if the array contains an Item",
  inputParameters: {
    array: { type: "array", subtype: "any", required: true },
    searchedItem: { type: "any", required: true },
  },
  outputData: {
    result: { type: "boolean", required: true },
  },
};
