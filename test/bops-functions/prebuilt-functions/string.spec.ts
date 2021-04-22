import { charAtBopsFunction } from "@api/bops-functions/prebuilt-functions/string/char-at";
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
});
