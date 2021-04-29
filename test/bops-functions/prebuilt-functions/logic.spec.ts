import { andGateBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/and";
import { isEqualToBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/equal";
import { higherOrEqualToBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/higher-or-equal-to";
import { higherThanBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/higher-than";
import { lowerOrEqualToBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/lower-or-equal-to";
import { lowerThanBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/lower-than";
import { orGateBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/or";
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

  describe("Lower Or Equal To", () => {
    it("Verifies If returns true for a lower comparison (A <= B)", () => {
      const A = 1;
      const B = 7;

      const result = lowerOrEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isLowerOrEqual: true });
    });

    it("Verifies If returns false for a higher comparison (A <= B)", () => {
      const A = 99301;
      const B = 1;

      const result = lowerOrEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isNotLowerOrEqual: true });
    });

    it("Verifies If returns true for an equal comparison (A <= B)", () => {
      const A = Math.PI;
      const B = A;

      const result = lowerOrEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isLowerOrEqual: true });
    });
  });

  describe("Higher Or Equal To", () => {
    it("Verifies If returns false for a lower comparison (A >= B)", () => {
      const A = 1;
      const B = 7;

      const result = higherOrEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isNotHigherOrEqual: true });
    });

    it("Verifies If returns true for a higher comparison (A >= B)", () => {
      const A = 99301;
      const B = 1;

      const result = higherOrEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isHigherOrEqual: true });
    });

    it("Verifies If returns true for an equal comparison (A >= B)", () => {
      const A = Math.PI;
      const B = A;

      const result = higherOrEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isHigherOrEqual: true });
    });
  });

  describe("Higher than", () => {
    it("Verifies If returns false for a lower comparison (A > B)", () => {
      const A = 1;
      const B = 7;

      const result = higherThanBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isNotHigher: true });
    });

    it("Verifies If returns true for a higher comparison (A > B)", () => {
      const A = 99301;
      const B = 1;

      const result = higherThanBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isHigher: true });
    });

    it("Verifies If returns false for an equal comparison (A > B)", () => {
      const A = Math.PI;
      const B = A;

      const result = higherThanBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isNotHigher: true });
    });
  });

  describe("Equal", () => {
    it("Verifies string equality", () => {
      const A = "Hello";
      const B = A;

      const result = isEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isEqual: true });
    });

    it("Verifies string inequality", () => {
      const A = "Hello";
      const B = "World";

      const result = isEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isNotEqual: true });
    });

    it("Verifies object equality", () => {
      const A = { name: "John", eyeColor: "blue" };
      const B = { name: "John", eyeColor: "blue" };

      const result = isEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isEqual: true });
    });

    it("Verifies object inequality", () => {
      const A = { name: "John", eyeColor: "blue" };
      const B = { name: "John", eyeColor: "brown" };

      const result = isEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isNotEqual: true });
    });

    it("Verifies array equality", () => {
      const A = [4, false, ["a"]];
      const B = [4, false, ["a"]];

      const result = isEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isEqual: true });
    });

    it("Verifies array inequality", () => {
      const A = [4, true, null];
      const B = [[4], true, null];

      const result = isEqualToBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isNotEqual: true });
    });
  });

  describe("And Gate", () => {
    it("A and B", () => {
      const A = true;
      const B = true;

      const result = andGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ andTrue: true });
    });
    it("A and !B", () => {
      const A = true;
      const B = false;

      const result = andGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ andFalse: true });
    });
    it("!A and !B", () => {
      const A = false;
      const B = false;

      const result = andGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ andFalse: true });
    });
  });

  describe("Or Gate", () => {
    it("A or B", () => {
      const A = true;
      const B = true;

      const result = orGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ orTrue: true });
    });
    it("A or !B", () => {
      const A = true;
      const B = false;

      const result = orGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ orTrue: true });
    });
    it("!A or !B", () => {
      const A = false;
      const B = false;

      const result = orGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ orFalse: true });
    });
  });
});
