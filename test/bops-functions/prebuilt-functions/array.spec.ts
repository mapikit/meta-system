import { arrayAtBopsFunction } from "../../../src/bops-functions/prebuilt-functions/array/array-at.js";
import { arrayFindIndexBopsFunction } from "../../../src/bops-functions/prebuilt-functions/array/find-index.js";
import { arrayIncludesBopsFunction } from "../../../src/bops-functions/prebuilt-functions/array/inlcudes.js";
import { arrayJoinBopsFunction } from "../../../src/bops-functions/prebuilt-functions/array/join.js";
import { arrayLengthBopsFunction } from "../../../src/bops-functions/prebuilt-functions/array/length.js";
import { arrayPushBopsFunction } from "../../../src/bops-functions/prebuilt-functions/array/push.js";
import { arrayRemoveBopsFunction } from "../../../src/bops-functions/prebuilt-functions/array/remove.js";
import { expect } from "chai";

describe("Array BOPs functions", () => {
  describe("Join", () => {
    it("Joins an array with separator ( - )", () => {
      const array = ["item 1", 2, false];

      const result = arrayJoinBopsFunction({ array, separator: " - " });

      expect(result).to.be.deep.equal({ result: "item 1 - 2 - false" });
    });

    it("Joins an array with no separator", () => {
      const array = ["item 1", 2, false];

      const result = arrayJoinBopsFunction({ array });

      expect(result).to.be.deep.equal({ result: "item 1,2,false" });
    });
  });
  describe("Length", () => {
    it("Gets the Length of an array with 4 items", () => {
      const array = ["item 1", 2, false, null];

      const result = arrayLengthBopsFunction({ array });

      expect(result).to.be.deep.equal({ result: 4 });
    });

    it("Gets the Length of an array with no items", () => {
      const array = [];

      const result = arrayLengthBopsFunction({ array });

      expect(result).to.be.deep.equal({ result: 0 });
    });
  });

  describe("Includes", () => {
    it("Verifies if a primitive item is included in the array", () => {
      const array = [1, true, "foo"];

      const result = arrayIncludesBopsFunction({ array, searchedItem: "foo" });

      expect(result).to.be.deep.equal({ result: true });
    });

    it("Verifies if a primitive item is not included in the array", () => {
      const array = [1, true, "foo"];

      const result = arrayIncludesBopsFunction({ array, searchedItem: "bar" });

      expect(result).to.be.deep.equal({ result: false });
    });

    it("Verifies if an object item is included in the array", () => {
      const array = [1, true, "foo", { a: "hello", b: "world" }];

      const result = arrayIncludesBopsFunction({ array, searchedItem: { a: "hello", b: "world" } });

      expect(result).to.be.deep.equal({ result: true });
    });

    it("Verifies if an object item is not included in the array", () => {
      const array = [1, true, "foo", { a: "hello", b: "world" }];

      const result = arrayIncludesBopsFunction({ array, searchedItem: { a: "hello", b: "John" } });

      expect(result).to.be.deep.equal({ result: false });
    });

    it("Verifies if an array item is included in the array", () => {
      const array = [1, true, "foo", ["inner", "array"]];

      const result = arrayIncludesBopsFunction({ array, searchedItem: ["inner", "array"] });

      expect(result).to.be.deep.equal({ result: true });
    });

    it("Verifies if an array item is not included in the array", () => {
      const array = [1, true, "foo", ["inner", "array"]];

      const result = arrayIncludesBopsFunction({ array, searchedItem: ["inner", "peace"] });

      expect(result).to.be.deep.equal({ result: false });
    });
  });

  describe("Array At", () => {
    it("Gets an item present in the array", () => {
      const array = ["1", 2, true, false, null];

      const result = arrayAtBopsFunction({ array, index: 4 });

      expect(result).to.be.deep.equal({ found: null });
    });

    it("Returns not found for an index not present in the array", () => {
      const array = ["1", 2, true, false, null];

      const result = arrayAtBopsFunction({ array, index: 99 });

      expect(result).to.be.deep.equal({ notFoundMessage: "There is no item present at the given index" });
    });

    it("Returns not found for an NaN index", () => {
      const array = ["1", 2, true, false, null];

      const result = arrayAtBopsFunction({ array, index: "---" as unknown as number });

      expect(result).to.be.deep.equal({ notFoundMessage: "There is no item present at the given index" });
    });
  });

  describe("Array Find Index", () => {
    it("Finds an existing primitive successfully", () => {
      const array = ["1", 2, true, false, null];

      const result = arrayFindIndexBopsFunction({ array, searchedItem: 2 });

      expect(result).to.be.deep.equal({ index: 1 });
    });

    it("Fails to find a missing primitive", () => {
      const array = ["1", 2, true, false, null];

      const result = arrayFindIndexBopsFunction({ array, searchedItem: "2" });

      expect(result).to.be.deep.equal({ notFoundMessage: "No item matchs in the given array" });
    });

    it("Finds an existing object successfully", () => {
      const array = ["1", 2, { A: "hello", B: "world" }, false, null];

      const result = arrayFindIndexBopsFunction({ array, searchedItem: { A: "hello", B: "world" } });

      expect(result).to.be.deep.equal({ index: 2 });
    });

    it("Fails to find a missing object", () => {
      const array = ["1", 2, { A: "hello", B: "world" }, false, null];

      const result = arrayFindIndexBopsFunction({ array, searchedItem: { A: "hello", B: "John" } });

      expect(result).to.be.deep.equal({ notFoundMessage: "No item matchs in the given array" });
    });
  });

  describe("Array Remove", () => {
    it("Removes an existing index successfully", () => {
      const array = ["1", 2, true, false, null];

      const result = arrayRemoveBopsFunction({ array, index: 1 });

      expect(result).to.be.deep.equal({
        resultingArray: ["1", true, false, null],
        removedItem: array[1],
      });
    });

    it("Fails to remove a Non Existing index", () => {
      const array = ["1", 2, true, false, null];

      const result = arrayRemoveBopsFunction({ array, index: 99 });

      expect(result).to.be.deep.equal({ notFoundMessage: "There is no item present at the given index" });
    });
  });

  describe("Array Push", () => {
    it("Pushes a single item into the array", () => {
      const array = ["1", 2, true, false, null];

      const result = arrayPushBopsFunction({ targetArray: array, item: "Hello World" });

      expect(result).to.be.deep.equal({ result: ["1", 2, true, false, null, "Hello World"] });
    });

    // it("Pushes a list of items into the array", () => {
    //   const array = ["1", 2, true, false, null];
    //   const newItems = [new Date(), 42];

    //   const result = arrayPushBopsFunction({ targetArray: array, newItems });

    //   expect(result).to.be.deep.equal({ result: ["1", 2, true, false, null, ... newItems] });
    // });

    it("Pushes a single item into a new array", () => {
      const result = arrayPushBopsFunction({ item: "Hello World" });

      expect(result).to.be.deep.equal({ result: ["Hello World"] });
    });

    // it("Pushes a list of items into a new array", () => {
    //   const newItems = [new Date(), 42];

    //   const result = arrayPushBopsFunction({ newItems });

    //   expect(result).to.be.deep.equal({ result: [... newItems] });
    // });

    // it("Pushes a single item and a list of items into the array", () => {
    //   const array = ["1", 2, true, false, null];
    //   const newItems = [new Date(), 42];
    //   const item = "Hello World";

    //   const result = arrayPushBopsFunction({ targetArray: array, item, newItems });

    //   expect(result).to.be.deep.equal({ result: [...array, item, ...newItems] });
    // });

    it("Returns an empty array for an empty execution", () => {
      const result = arrayPushBopsFunction({});

      expect(result).to.be.deep.equal({ result: [] });
    });
  });
});
