import { isNillBopsFunction } from "../../../src/bops-functions/prebuilt-functions/assertion/is-nill";
import { expect } from "chai";

describe("Assertion BOps Functions", () => {
  describe("Is Nill BOps function", () => {
    it("Validates string not nill", () => {
      const value = "11111";

      const result = isNillBopsFunction({ value });

      expect(result).to.be.deep.equal({ isNill: false });
    });
    it("Validates undefined is nill", () => {
      const value = undefined;

      const result = isNillBopsFunction({ value });

      expect(result).to.be.deep.equal({ isNill: true });
    });
    it("Validates null is nill", () => {
      const value = null;

      const result = isNillBopsFunction({ value });

      expect(result).to.be.deep.equal({ isNill: true });
    });
  });
});
