import { createObjectBopsFunction } from "@api/bops-functions/prebuilt-functions/object/create";
import { expect } from "chai";

describe("Object Bops Functions", () => {
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
