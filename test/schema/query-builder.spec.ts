import { MongoSchemaQueryBuilder } from "../../src/schemas/application/query-builder/query-builder";
import { expect } from "chai";
import { complexExampleSchema } from "../schema/common-schemas/complex-example-schema";
import { flatExampleSchema } from "../schema/common-schemas/flat-example-schema";
import { deepExampleSchema } from "../schema/common-schemas/deep-example-schema";

describe("Schema Query Builder", () => {
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
    expect(mongoQuery["job.wage"].$gt).to.be.equal(nameAndJobDeepQuery.job.wage.greater_than);
    expect(mongoQuery["job.hiredAt"].$lte).to.be.equal(nameAndJobDeepQuery.job.hiredAt.lower_or_equal_to);
  });

  it("Builds Complex Query Successfully", () => {
    const nameAndAcquaintancesComplexQuery = {
      name: { "equal_to": "John" },
      hobbies: { "contains_all": ["Piano", "Golf"] },
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
    expect(mongoQuery.acquaintances.$all[0].$elemMatch).to
      .include(nameAndAcquaintancesComplexQuery.acquaintances.contains);
  });
});
