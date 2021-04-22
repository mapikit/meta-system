import { charAtBopsFunction } from "@api/bops-functions/prebuilt-functions/string/char-at";
import { countStringFunction } from "@api/bops-functions/prebuilt-functions/string/count";
import { indexOfStringFunction } from "@api/bops-functions/prebuilt-functions/string/index-of";
import { stringReplaceFunction } from "@api/bops-functions/prebuilt-functions/string/replace";
import { stringToNumberBopsFunction } from "@api/bops-functions/prebuilt-functions/string/to-number";
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

  describe("Count", () => {
    it("Counts the amount of times a string appears in another string", () => {
      const string = "yare yare daze";
      const search = "yare";

      const result = countStringFunction({ string, search });

      expect(result).to.be.deep.equal({ count: 2 });
    });

    it("Counts the amount of times a string that not exists appears in another string", () => {
      const string = "celular";
      const search = "lol";

      const result = countStringFunction({ string, search });

      expect(result).to.be.deep.equal({ count: 0 });
    });
  });

  describe("String to Number", () => {
    it("Converts Successfully a valid string", () => {
      const string = "0.1235888189918";

      const result = stringToNumberBopsFunction({ string });

      expect(result).to.be.deep.equal({ result: 0.1235888189918 });
    });

    it("Converts Successfully a scientific notation string", () => {
      const string = "1.344e-14";

      const result = stringToNumberBopsFunction({ string });

      expect(result).to.be.deep.equal({ result: Number("1.344e-14") });
    });

    it("Fails to convert an invalid String", () => {
      const string = "1.1414x";

      const result = stringToNumberBopsFunction({ string });

      expect(result).to.be.deep.equal({ errorMessage: "Given string is not convertible to a number" });
    });
  });
});
