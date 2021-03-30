import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { MongoSchemaQueryBuilder } from "@api/schemas/application/query-builder/query-builder";
import { expect } from "chai";

const flatExampleSchema : SchemasType = {
  name: "exampleFlatSchema",
  format: {
    name: { type: "string" },
    age: { type: "number" },
    favoriteFood: { type: "string" },
    eyeColour: { type: "string" },
    height: { type: "number" },
  },
  routes: {
    getMethodEnabled: false,
    postMethodEnabled: false,
    deleteMethodEnabled: false,
    patchMethodEnabled: false,
    putMethodEnabled: false,
    queryParamsGetEnabled: false,
  },
};

const deepExampleSchema : SchemasType = {
  name: "exampleDeepSchema",
  format: {
    name: { type: "string" },
    job: {
      type: "object",
      data: {
        wage: { type: "number" },
        name: { type: "string" },
        hiredAt: { type: "date" },
      },
    },
  },
  routes: {
    getMethodEnabled: false,
    postMethodEnabled: false,
    deleteMethodEnabled: false,
    patchMethodEnabled: false,
    putMethodEnabled: false,
    queryParamsGetEnabled: false,
  },
};

const complexExampleSchema : SchemasType = {
  name: "exampleComplexSchema",
  format: {
    name: { type: "string" },
    hobbies: {
      type: "array",
      data: "string",
    },
    acquaintances: {
      type: "array",
      data: {
        name: { type: "string" },
        gender: { type: "string" },
        age: { type: "number" },
      },
    },
  },
  routes: {
    getMethodEnabled: false,
    postMethodEnabled: false,
    deleteMethodEnabled: false,
    patchMethodEnabled: false,
    putMethodEnabled: false,
    queryParamsGetEnabled: false,
  },
};

describe.only("Schema Query Builder", () => {
  it("Builds flat query successfully", () => {
    const nameAndHeightQuery = {
      name: { "equal_to": "John", "exists": true },
      height: { "greater_than": 167 },
    };

    const queryBuilder = new MongoSchemaQueryBuilder(nameAndHeightQuery, flatExampleSchema);
    const mongoQuery = queryBuilder.getFullMongoQuery();

    expect(mongoQuery.name.$eq).to.be.equal(nameAndHeightQuery.name.equal_to);
    expect(mongoQuery.name.$exists).to.be.equal(nameAndHeightQuery.name.exists);
    expect(mongoQuery.height.$gt).to.be.equal(nameAndHeightQuery.height.greater_than);
  });

  it("Builds Deep Query successfully", () => {
    const nameAndJobDeepQuery = {
      name: { "equal_to": "John" },
      job: {
        wage: { "greater_than": 560 },
        hiredAt: { "lower_or_equal_to": new Date() },
      },
    };

    const queryBuilder = new MongoSchemaQueryBuilder(nameAndJobDeepQuery, deepExampleSchema);
    const mongoQuery = queryBuilder.getFullMongoQuery();

    expect(mongoQuery.name.$eq).to.be.equal(nameAndJobDeepQuery.name.equal_to);
    expect(mongoQuery.job.wage.$gt).to.be.equal(nameAndJobDeepQuery.job.wage.greater_than);
    expect(mongoQuery.job.hiredAt.$lte).to.be.equal(nameAndJobDeepQuery.job.hiredAt.lower_or_equal_to);
  });

  it("Builds Complex Query Successfully", () => {
    const nameAndAcquaintancesComplexQuery = {
      name: { "equal_to": "John" },
      hobbies: { "contains_all": [] },
      acquaintances: { "contains": {
        name: "Mary",
        age: 37,
        gender: "female",
      } },
    };

    const queryBuilder = new MongoSchemaQueryBuilder(nameAndAcquaintancesComplexQuery, complexExampleSchema);
    const mongoQuery = queryBuilder.getFullMongoQuery();

    expect(mongoQuery.name.$eq).to.be.equal(nameAndAcquaintancesComplexQuery.name.equal_to);
    expect(mongoQuery.hobbies.$all).to.be.equal(nameAndAcquaintancesComplexQuery.hobbies.contains_all);
    expect(mongoQuery.acquaintances.$all).to.include(nameAndAcquaintancesComplexQuery.acquaintances.contains);
  });
});
