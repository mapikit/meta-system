import { absoluteBopsFunction } from "@api/bops-functions/prebuilt-functions/math/absolute";
import { addBopsFunction } from "@api/bops-functions/prebuilt-functions/math/add";
import { divideBopsFunction } from "@api/bops-functions/prebuilt-functions/math/divide";
import { modulusBopsFunction } from "@api/bops-functions/prebuilt-functions/math/modulus";
import { multiplyBopsFunction } from "@api/bops-functions/prebuilt-functions/math/multipy";
import { roundBopsFunction } from "@api/bops-functions/prebuilt-functions/math/round";
import { subtractBopsFunction } from "@api/bops-functions/prebuilt-functions/math/subtract";
import { expect } from "chai";
import { random } from "faker";

describe.only("Math Prebuilt Functions", () => {
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
  });
});
