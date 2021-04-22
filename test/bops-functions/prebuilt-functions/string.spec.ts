import { charAtBopsFunction } from "@api/bops-functions/prebuilt-functions/string/char-at";
import { indexOfStringFunction } from "@api/bops-functions/prebuilt-functions/string/index-of";
import { stringReplaceFunction } from "@api/bops-functions/prebuilt-functions/string/replace";
import { expect } from "chai";

describe("String BOPs functions", () => {
  describe("CharAt", () => {
    it("Gets the character at the given index position", () => {
      const string = "Hello World";

      const result = charAtBopsFunction({ string, index: 6 });

      expect(result).to.be.deep.equal({ found: "W" });
    });

    it("Gets undefined when there is nothing at the index position", () => {
      const string = "Hello World";

      const result = charAtBopsFunction({ string, index: 99 });

      expect(result).to.be.deep
        .equal({ notFoundMessage: "There is no character present at the given index" });
    });
  });

  describe("Index Of", () => {
    it("Gets the index of a substring in a given string", () => {
      const string = "John Doe";
      const search = "hn";

      const result = indexOfStringFunction({ string, search });

      expect(result).to.be.deep.equal({ index: 2 });
    });

    it("Gets the index of a substring that is not found in a given string", () => {
      const string = "John Doe";
      const search = "1";

      const result = indexOfStringFunction({ string, search });

      expect(result).to.be.deep.equal({ index: -1 });
    });
  });

  describe("Replace", () => {
    it("Replaces an existing substring", () => {
      const baseString = "Welcome to the Jungle";
      const search = "to the Jungle";
      const replacer = "to my den";

      const result = stringReplaceFunction({ baseString, search, replacer });

      expect(result).to.be.deep.equal({ result: "Welcome to my den" });
    });

    it("Does not replace a substring that does not exist", () => {
      const baseString = "Welcome to the Jungle";
      const search = "to the jungle"; // Lower case
      const replacer = "oops";

      const result = stringReplaceFunction({ baseString, search, replacer });

      expect(result).to.be.deep.equal({ result: "Welcome to the Jungle" });
    });
  });
});
