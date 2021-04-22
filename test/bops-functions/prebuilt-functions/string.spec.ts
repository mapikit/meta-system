import { charAtBopsFunction } from "@api/bops-functions/prebuilt-functions/string/char-at";
import { indexOfStringFunction } from "@api/bops-functions/prebuilt-functions/string/index-of";
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
});
