import { numberToStringFunction } from "@api/bops-functions/prebuilt-functions/number/to-string";
import { expect } from "chai";

describe("Number BOPs Function", () => {
  describe("Number To String", () => {
    it("Converts a number to string", () => {
      const number = 911;

      const result = numberToStringFunction({ number });

      expect(result).to.be.deep.equal({ result: "911" });
    });

    it("Converts NaN to string", () => {
      const number = Number.NaN;

      const result = numberToStringFunction({ number });

      expect(result).to.be.deep.equal({ result: "NaN" });
    });
  });
});
