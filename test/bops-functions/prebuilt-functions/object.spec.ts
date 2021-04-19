import { createObjectBopsFunction } from "@api/bops-functions/prebuilt-functions/object/create";
import { getObjectKeysBopsFunction } from "@api/bops-functions/prebuilt-functions/object/keys";
import { expect } from "chai";

describe("Object Bops Functions", () => {
  describe("Object Create", () => {
    it("Creates an object with the given key and values", () => {
      const key = "name";
      const value = "Jonathan";

      const result = createObjectBopsFunction({ key, value });

      expect(result).to.be.deep.equal({ created: { name: "Jonathan" } });
    });

    it("Creates an empty object", () => {
      const result = createObjectBopsFunction({});

      expect(result).to.be.deep.equal({ created: {} });
    });

    it("Creates an empty object if the key is not passed", () => {
      const result = createObjectBopsFunction({ value: "Test" });

      expect(result).to.be.deep.equal({ created: {} });
    });
  });

  describe("Keys", () => {
    it("Gets keys of the object successfully", () => {
      const object = { name: "John", lastName: "Doe", age: 17 };

      const result = getObjectKeysBopsFunction({ object });

      expect(result).to.be.deep.equal({ result: [ "name", "lastName", "age" ] });
    });

    it("Converts Non numeric Keys to String", () => {
      const object = { name: "John", lastName: "Doe", age: 17, 6: null };

      const result = getObjectKeysBopsFunction({ object });

      expect(result).to.be.deep.equal({ result: [ "6" ,"name", "lastName", "age" ] });
    });
  });
});
