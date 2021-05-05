import { boolToNumberBopsFunction } from "@api/bops-functions/prebuilt-functions/boolean/bool-to-number";
import { boolToStringBopsFunction } from "@api/bops-functions/prebuilt-functions/boolean/bool-to-string";
import { expect } from "chai";

describe("Boolean BOps functions", () => {
  describe("Bool to String", () => {
    it("True to 'true'", () => {
      const booleanValue = true;

      const result = boolToStringBopsFunction({ boolean: booleanValue });

      expect(result).to.be.deep.equal({ result: "true" });
    });

    it("False to 'false'", () => {
      const booleanValue = false;

      const result = boolToStringBopsFunction({ boolean: booleanValue });

      expect(result).to.be.deep.equal({ result: "false" });
    });
  });

  describe("Bool to Number", () => {
    it("True to 1", () => {
      const booleanValue = true;

      const result = boolToNumberBopsFunction({ boolean: booleanValue });

      expect(result).to.be.deep.equal({ result: 1 });
    });

    it("False to 0", () => {
      const booleanValue = false;

      const result = boolToNumberBopsFunction({ boolean: booleanValue });

      expect(result).to.be.deep.equal({ result: 0 });
    });
  });
});
