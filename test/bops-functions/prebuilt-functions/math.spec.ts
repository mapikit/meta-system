import { addBopsFunction } from "@api/bops-functions/prebuilt-functions/math/add";
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
});
