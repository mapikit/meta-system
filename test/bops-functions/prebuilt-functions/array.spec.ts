import { arrayIncludesBopsFunction } from "@api/bops-functions/prebuilt-functions/array/inlcudes";
import { joinBopsFunction } from "@api/bops-functions/prebuilt-functions/array/join";
import { arrayLengthBopsFunction } from "@api/bops-functions/prebuilt-functions/array/length";
import { expect } from "chai";

describe("Array BOPs functions", () => {
  describe("Join", () => {
    it("Joins an array with separator ( - )", () => {
      const array = ["item 1", 2, false];

      const result = joinBopsFunction({ array, separator: " - " });

      expect(result).to.be.deep.equal({ result: "item 1 - 2 - false" });
    });

    it("Joins an array with no separator", () => {
      const array = ["item 1", 2, false];

      const result = joinBopsFunction({ array });

      expect(result).to.be.deep.equal({ result: "item 1,2,false" });
    });
  });
  describe("Length", () => {
    it("Gets the Lenght of an array with 4 items", () => {
      const array = ["item 1", 2, false, null];

      const result = arrayLengthBopsFunction({ array });

      expect(result).to.be.deep.equal({ result: 4 });
    });

    it("Gets the Lenght of an array with no items", () => {
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
});
