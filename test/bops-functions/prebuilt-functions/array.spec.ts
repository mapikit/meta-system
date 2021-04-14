import { joinBopsFunction } from "@api/bops-functions/prebuilt-functions/array/join";
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
});
