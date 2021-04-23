import { randomNumberBopsFunction } from "@api/bops-functions/prebuilt-functions/number/random";
import { toExponentialBopsFunction } from "@api/bops-functions/prebuilt-functions/number/to-exponential";
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

      expect(result).to.be.deep.equal({ errorMessage: "Cannot convert NaN" });
    });
  });

  describe("To Exponential", () => {
    it("Transforms a valid number to an exponential", () => {
      const number = 19932;
      const result = toExponentialBopsFunction({ number });

      expect(result).to.be.deep.equal({ result: "1.9932e+4" });
    });

    it("Transforms a really small number to an exponential", () => {
      const number = 0.00000000519932;
      const result = toExponentialBopsFunction({ number });

      expect(result).to.be.deep.equal({ result: "5.19932e-9" });
    });

    it("Transforms a number to an exponential with the meaningful digits", () => {
      const number = 325234513896555;
      const digits = 6;
      const result = toExponentialBopsFunction({ number, decimalPlaces: digits });

      expect(result).to.be.deep.equal({ result: "3.252345e+14" });
    });

    it("Fails to transform NaN into an exponential", () => {
      const number = Number.NaN;
      const result = toExponentialBopsFunction({ number });

      expect(result).to.be.deep.equal({ errorMessage: "Cannot make NaN exponential" });
    });
  });

  describe("Random", () => {
    it("Generates a random number between 0 and 1", () => {
      const result = randomNumberBopsFunction();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any).result).to.be.lte(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any).result).to.be.gte(0);
    });
  });
});
