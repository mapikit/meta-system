import { combineObjectBopsFunction } from "../../../src/bops-functions/prebuilt-functions/object/combine";
import { createObjectBopsFunction } from "../../../src/bops-functions/prebuilt-functions/object/create";
import { getObjectPropertyValueBopsFunction } from "../../../src/bops-functions/prebuilt-functions/object/get-value";
import { getObjectKeysBopsFunction } from "../../../src/bops-functions/prebuilt-functions/object/keys";
import { objectToStringBopsFunction } from "../../../src/bops-functions/prebuilt-functions/object/to-string";
import { getObjectValuesBopsFunction } from "../../../src/bops-functions/prebuilt-functions/object/values";
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

      expect(result).to.be.deep.equal({ keys: [ "name", "lastName", "age" ] });
    });

    it("Converts Non numeric Keys to String", () => {
      const object = { name: "John", lastName: "Doe", age: 17, 6: null };

      const result = getObjectKeysBopsFunction({ object });

      expect(result).to.be.deep.equal({ keys: [ "6" ,"name", "lastName", "age" ] });
    });
  });

  describe("Values", () => {
    it("Gets a list of the Object Values", () => {
      const object = {
        date: new Date(0),
        string: "sadafdg",
        number: 12345,
        object: { name: "John" },
        null: null,
        undefined: undefined,
        nan: Number.NaN,
      };

      const result = getObjectValuesBopsFunction({ object });

      expect(result).to.be.deep.equal(
        { values: [new Date(0), "sadafdg", 12345, { name: "John" }, null, undefined, Number.NaN ] },
      );
    });
  });

  describe("Combine", () => {
    it("Combines two objects", () => {
      const object1 = { name: "John" };
      const object2 = { lastName: "Doe" };

      const result = combineObjectBopsFunction({ object1, object2 });

      expect(result).to.be.deep.equal({ combined: { name: "John", lastName: "Doe" } });
    });

    it("Object 2 overrides properties with same name from object 1", () => {
      const object1 = { name: "John", lastName: "Doe", age: 68 };
      const object2 = { lastName: "Cena", age: 43, job: "Actor" };

      const result = combineObjectBopsFunction({ object1, object2 });

      expect(result).to.be.deep.equal({ combined: { name: "John", lastName: "Cena", age: 43, job: "Actor" } });
    });
  });

  describe("Get Property Value", () => {
    it("Gets the value of an object Property", () => {
      const object = { name: "John", role :"Main Character" };

      const result = getObjectPropertyValueBopsFunction({ object, key: "role" });

      expect(result).to.be.deep.equal({ value: "Main Character" });
    });

    it("Gets undefined when the key does not exist", () => {
      const object = { name: "John", role :"Main Character" };

      const result = getObjectPropertyValueBopsFunction({ object, key: "age" });

      expect(result).to.be.deep.equal({ value: undefined });
    });
  });

  describe("To String", () => {
    it("Transforms an object into a string", () => {
      const object = { name: "John", lastName: "Doe" };

      const result = objectToStringBopsFunction({ object });

      expect(result).to.be.deep.equal({ result: "{\"name\":\"John\",\"lastName\":\"Doe\"}" });
    });
  });
});
