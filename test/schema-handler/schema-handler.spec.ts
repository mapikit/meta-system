/* eslint-disable max-lines-per-function */
require("module-alias/register");
import chai from "chai";
import { SchemaHandler } from "@api/common/schema-handler";
import { schemaFactory } from "@test/factories/schema-factory";
import axios from "axios";
const expect = chai.expect;

describe.only("Schema Handler Test", () => {

  it("Successfully initiates schema routes", async () => {
    const schema = schemaFactory({ routes : {
      getMethodEnabled: true,
      postMethodEnabled : true,
      putMethodEnabled : true,
      patchMethodEnabled : true,
      deleteMethodEnabled : true,
      queryParamsGetEnabled : true } });
    const schemaHandler = new SchemaHandler(schema);
    await schemaHandler.initialize("fakeSystem");
    await schemaHandler.router.listenOnPort(8000);
    await axios.get(`http://localhost:8000/fakeSystem/${schema.name}`)
      .catch(err => {
        console.log(err.name);
      })
      .then(response => {
        console.log(response["data"]);
      });
  });
});
