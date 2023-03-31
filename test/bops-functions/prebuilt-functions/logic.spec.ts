import { andGateBopsFunction } from "../../../src/bops-functions/prebuilt-functions/logic/and.js";
import { isEqualToBopsFunction } from "../../../src/bops-functions/prebuilt-functions/logic/equal.js";
import { higherOrEqualToBopsFunction } from "../../../src/bops-functions/prebuilt-functions/logic/higher-or-equal-to.js";
import { higherThanBopsFunction } from "../../../src/bops-functions/prebuilt-functions/logic/higher-than.js";
import { lowerOrEqualToBopsFunction } from "../../../src/bops-functions/prebuilt-functions/logic/lower-or-equal-to.js";
import { lowerThanBopsFunction } from "../../../src/bops-functions/prebuilt-functions/logic/lower-than.js";
import { notBopsFunction } from "../../../src/bops-functions/prebuilt-functions/logic/not.js";
import { orGateBopsFunction } from "../../../src/bops-functions/prebuilt-functions/logic/or.js";
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

      expect(result).to.be.deep.equal({ isLower: false });
    });

    it("Verifies If returns false for an equal comparison (A < B)", () => {
      const A = Math.PI;
      const B = A;

      const result = lowerThanBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ isLower: false });
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

      expect(result).to.be.deep.equal({ isLowerOrEqual: false });
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

      expect(result).to.be.deep.equal({ isHigherOrEqual: false });
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

      expect(result).to.be.deep.equal({ isHigher: false });
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

      expect(result).to.be.deep.equal({ isHigher: false });
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

      expect(result).to.be.deep.equal({ isEqual: false });
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

      expect(result).to.be.deep.equal({ isEqual: false });
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

      expect(result).to.be.deep.equal({ isEqual: false });
    });
  });

  describe("And Gate", () => {
    it("A and B", () => {
      const A = true;
      const B = true;

      const result = andGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ bothTrue: true });
    });
    it("A and !B", () => {
      const A = true;
      const B = false;

      const result = andGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ bothTrue: false });
    });
    it("!A and !B", () => {
      const A = false;
      const B = false;

      const result = andGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ bothTrue: false });
    });
  });

  describe("Or Gate", () => {
    it("A or B", () => {
      const A = true;
      const B = true;

      const result = orGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ eitherIsTrue: true });
    });
    it("A or !B", () => {
      const A = true;
      const B = false;

      const result = orGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ eitherIsTrue: true });
    });
    it("!A or !B", () => {
      const A = false;
      const B = false;

      const result = orGateBopsFunction({ A , B });

      expect(result).to.be.deep.equal({ eitherIsTrue: false });
    });
  });

  describe("Not", () => {
    it("Inverts false to true", () => {
      const A = false;

      const result = notBopsFunction({ A });

      expect(result).to.be.deep.equal({ result: true });
    });
    it("Inverts true to false", () => {
      const A = true;

      const result = notBopsFunction({ A });

      expect(result).to.be.deep.equal({ result: false });
    });
  });

  // describe("if", () => {
  //   it("Branches to True", () => {
  //     const conditional = true;

  //     const result = ifBopsFunction({ conditional });

  //     expect(result).to.be.deep.equal({ conditionResultTrue: true });
  //   });
  //   it("Branches to False", () => {
  //     const conditional = false;

  //     const result = ifBopsFunction({ conditional });

  //     expect(result).to.be.deep.equal({ conditionResultFalse: true });
  //   });
  // });
});
