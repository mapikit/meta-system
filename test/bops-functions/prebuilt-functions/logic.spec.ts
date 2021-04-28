import { lowerThanBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/lower-than";
import { expect } from "chai";

describe("Logic BOPs function", () => {
  describe("Lower Than", () => {
    it("Verifies If returns true for a lower comparison (A < B)", () => {
      const A = 1;
      const B = 7;

      const result = lowerThanBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isLower: true });
    });

    it("Verifies If returns false for a higher comparison (A < B)", () => {
      const A = 99301;
      const B = 1;

      const result = lowerThanBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isNotLower: true });
    });

    it("Verifies If returns false for an equal comparison (A < B)", () => {
      const A = Math.PI;
      const B = A;

      const result = lowerThanBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isNotLower: true });
    });
  });
});
