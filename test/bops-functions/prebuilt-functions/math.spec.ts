import { absoluteBopsFunction } from "../../../src/bops-functions/prebuilt-functions/math/absolute.js";
import { addBopsFunction } from "../../../src/bops-functions/prebuilt-functions/math/add.js";
import { divideBopsFunction } from "../../../src/bops-functions/prebuilt-functions/math/divide.js";
import { exponentialBopsFunction } from "../../../src/bops-functions/prebuilt-functions/math/exponential.js";
import { modulusBopsFunction } from "../../../src/bops-functions/prebuilt-functions/math/modulus.js";
import { multiplyBopsFunction } from "../../../src/bops-functions/prebuilt-functions/math/multipy.js";
import { roundBopsFunction } from "../../../src/bops-functions/prebuilt-functions/math/round.js";
import { squareRootBopsFunction } from "../../../src/bops-functions/prebuilt-functions/math/square-root.js";
import { subtractBopsFunction } from "../../../src/bops-functions/prebuilt-functions/math/subtract.js";
import { expect } from "chai";
import faker from "faker";
const { random } = faker;

describe("Math Prebuilt Functions", () => {
  const getRandomNumber = () : number => random.number({ precision: 2 });
  describe("Add", () => {
    it("Adds a list of number successfully", () => {
      const numbersToAdd = [getRandomNumber(), getRandomNumber(), getRandomNumber()];
      const result = addBopsFunction({ numbersToAdd });
      expect(result).to.be.deep.equal({ result: numbersToAdd[0] + numbersToAdd[1] + numbersToAdd[2] });
    });

    it("Fails to add NAN arguments", () => {
      const numbersToAdd = [getRandomNumber(), "-----", getRandomNumber()];
      const result = addBopsFunction({ numbersToAdd: numbersToAdd as number[] });
      expect(result).to.be.deep.equal({ errorMessage: "One of the arguments provided was not a number" });
    });
  });

  describe("Subtract", () => {
    it("Subtracts B from A successfully", () => {
      const A = getRandomNumber();
      const B = getRandomNumber();

      const result = subtractBopsFunction({ A, B });
      expect(result).to.be.deep.equal({ result: A - B });
    });

    it("Fails to subtract NAN arguments", () => {
      const A = "----" as unknown as number;
      const B = getRandomNumber();

      const result = subtractBopsFunction({ A, B });
      expect(result).to.be.deep.equal({ errorMessage: "One of the arguments provided was not a number" });
    });
  });

  describe("Multiply", () => {
    it("Multiplies the given list of numbers successfully", () => {
      const numbersToMultiply = [0.2, 0.2, 5];
      const result = multiplyBopsFunction({ numbersToMultiply });
      expect(result).to.be.deep.equal({ result: 0.2 });
    });

    it("Fails to multiply NAN arguments", () => {
      const numbersToMultiply = [getRandomNumber(), "------" as unknown as number, getRandomNumber()];
      const result = multiplyBopsFunction({ numbersToMultiply });
      expect(result).to.be.deep.equal({ errorMessage: "One of the arguments provided was not a number" });
    });
  });

  describe("Divide", () => {
    it("Divides B from A successfully", () => {
      const A = getRandomNumber();
      const B = getRandomNumber();

      const result = divideBopsFunction({ A, B });
      expect(result).to.be.deep.equal({ result: A / B });
    });

    it("Fails to divide NAN arguments", () => {
      const A = "----" as unknown as number;
      const B = getRandomNumber();

      const result = divideBopsFunction({ A, B });
      expect(result).to.be.deep.equal({ errorNaN: "One of the arguments provided was not a number" });
    });

    it("Fails to divide by 0", () => {
      const A = getRandomNumber();
      const B = 0;

      const result = divideBopsFunction({ A, B });
      expect(result).to.be.deep.equal({ errorDivideByZero: "Cannot divide by zero" });
    });
  });

  describe("Round", () => {
    it("Rounds a number with a precision of 0.01", () => {
      const A = 3841.933321;

      const result = roundBopsFunction({ input: A, precision: 0.01 });

      expect(result).to.be.deep.equal({ result: 3841.93 });
    });

    it("Rounds a number with a precision of 0.00001", () => {
      const A = 0.9915;

      const result = roundBopsFunction({ input: A, precision: 0.00001 });

      expect(result).to.be.deep.equal({ result: A });
    });

    it("Rounds a number with a precision of 16", () => {
      const A = 85194;

      const result = roundBopsFunction({ input: A, precision: 16 });

      expect(result).to.be.deep.equal({ result: 85200 });
    });

    it("Rounds a number with a precision of -16", () => {
      const A = 85194;

      const result = roundBopsFunction({ input: A, precision: -16 });

      expect(result).to.be.deep.equal({ result: 85200 });
    });

    it("Rounds a number with a precision of 3", () => {
      const A = 8;

      const result = roundBopsFunction({ input: A, precision: 3 });

      expect(result).to.be.deep.equal({ result: 9 });
    });

    it("Rounds up - precision greater than number", () => {
      const A = 8;

      const result = roundBopsFunction({ input: A, precision: 10 });

      expect(result).to.be.deep.equal({ result: 10 });
    });

    it("Rounds down - precision greater than number", () => {
      const A = 8;

      const result = roundBopsFunction({ input: A, precision: 20 });

      expect(result).to.be.deep.equal({ result: 0 });
    });

    it("Fails to round NaN", () => {
      const A = "----" as unknown as number;

      const result = roundBopsFunction({ input: A, precision: 0.1 });

      expect(result).to.be.deep.equal({ errorNaN: "One of the arguments provided was not a number" });
    });
  });

  describe("Abosulte", () => {
    it("Gets the absolute value of 3", () => {
      const A = 3;

      const result = absoluteBopsFunction({ input: A });

      expect(result).to.be.deep.equal({ result: A });
    });

    it("Gets the absolute value of -3", () => {
      const A = -3;

      const result = absoluteBopsFunction({ input: A });

      expect(result).to.be.deep.equal({ result: -A });
    });

    it("Gets the absolute value of 0.0024", () => {
      const A = 0.0024;

      const result = absoluteBopsFunction({ input: A });

      expect(result).to.be.deep.equal({ result: A });
    });

    it("Gets the absolute value of -0.0024", () => {
      const A = -0.0024;

      const result = absoluteBopsFunction({ input: A });

      expect(result).to.be.deep.equal({ result: -A });
    });

    it("Gets the absolute value of 0", () => {
      const A = 0;

      const result = absoluteBopsFunction({ input: A });

      expect(result).to.be.deep.equal({ result: A });
    });
  });

  describe("Modulus", () => {
    it("Gets the remainder of 5/3", () => {
      const A = 5;
      const B = 3;

      const result = modulusBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ result: 2 });
    });

    it("Gets the remainder of 900/7.3", () => {
      const A = 900;
      const B = 7.3;

      const result = modulusBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ result: 2.1 });
    });

    it("Fails to get the remainder of NaN", () => {
      const A = "---" as unknown as number;
      const B = 7.3;

      const result = modulusBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ errorNotANumber: "One of the arguments provided was not a number" });
    });

    it("Fails to get the remainder of a division by 0", () => {
      const A = 22;
      const B = 0;

      const result = modulusBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ errorDivisionByZero: "Cannot Divide By Zero" });
    });
  });

  describe("Exponential", () => {
    it("Raises 2 to the power of 5", () => {
      const A = 2;
      const B = 5;

      const result = exponentialBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ result: 32 });
    });

    it("Raises 5 to the power of -2", () => {
      const A = 5;
      const B = -2;

      const result = exponentialBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ result: 0.04 });
    });

    it("Fails due to NaN argument", () => {
      const A = 5;
      const B = "---" as unknown as number;

      const result = exponentialBopsFunction({ A, B });

      expect(result).to.be.deep.equal({ errorMessage: "One of the arguments provided was not a number" });
    });
  });

  describe("Square Root", () => {
    it("Gets the Square Root of 64", () => {
      const A = 64;

      const result = squareRootBopsFunction({ A });

      expect(result).to.be.deep.equal({ result: 8 });
    });

    it("Fails to get the Square Root of a negative number", () => {
      const A = -64;

      const result = squareRootBopsFunction({ A });

      expect(result).to.be.deep.equal({ errorNegativeA: "Value must not be a negative number" });
    });

    it("Fails to get the Square Root of NaN", () => {
      const A = "---" as unknown as number;

      const result = squareRootBopsFunction({ A });

      expect(result).to.be.deep.equal({ errorNaN: "One of the arguments provided was not a number" });
    });
  });
});
