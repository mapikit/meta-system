import { absoluteBopsFunction } from "@api/bops-functions/prebuilt-functions/math/absolute";
import { addBopsFunction } from "@api/bops-functions/prebuilt-functions/math/add";
import { divideBopsFunction } from "@api/bops-functions/prebuilt-functions/math/divide";
import { multiplyBopsFunction } from "@api/bops-functions/prebuilt-functions/math/multipy";
import { roundBopsFunction } from "@api/bops-functions/prebuilt-functions/math/round";
import { subtractBopsFunction } from "@api/bops-functions/prebuilt-functions/math/subtract";
import { expect } from "chai";
import { random } from "faker";

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
      const numbersToMultiply = [getRandomNumber(), getRandomNumber(), getRandomNumber()];
      const result = multiplyBopsFunction({ numbersToMultiply });
      expect(result).to.be.deep.equal({ result: numbersToMultiply[0] * numbersToMultiply[1] * numbersToMultiply[2] });
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

    it("Rounds a number with a precision of 0.0005", () => {
      const A = 0.9915;

      const result = roundBopsFunction({ input: A, precision: 0.0005 });

      expect(result).to.be.deep.equal({ result: A });
    });

    it("Rounds a number with a precision of 16", () => {
      const A = 85194;

      const result = roundBopsFunction({ input: A, precision: 16 });

      expect(result).to.be.deep.equal({ result: 85184 });
    });

    it("Rounds a number with a precision of 3", () => {
      const A = 8;

      const result = roundBopsFunction({ input: A, precision: 3 });

      expect(result).to.be.deep.equal({ result: 6 });
    });

    it("Fails to round a negative precision", () => {
      const A = 8;

      const result = roundBopsFunction({ input: A, precision: -16 });

      expect(result).to.be.deep.equal({ errorNegativePrecision: "Precision cannot be a negative value" });
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
});
