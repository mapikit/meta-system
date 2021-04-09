import { addBopsFunction } from "@api/bops-functions/prebuilt-functions/math/add";
import { divideBopsFunction } from "@api/bops-functions/prebuilt-functions/math/divide";
import { multiplyBopsFunction } from "@api/bops-functions/prebuilt-functions/math/multipy";
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
});
