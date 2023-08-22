import { InternalMetaFunction } from "../../internal-meta-function.js";
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
  functionName: "arrayFindIndex",
  description: "Find the index of a given item in the array",
  input: {
    array: { type: "array", subtype: "any", required: true },
    searchedItem: { type: "any", required: true },
  },
  output: {
    index: { type: "number", required: false },
    notFoundMessage: { type: "string", required: false },
  },
};
