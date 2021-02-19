import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";

export type SchemaFunctionErrorType = {
  [key in SchemasFunctions] : {
    errorCode : string;
    message : string;
  }
}

export const SchemaFunctionErrors : SchemaFunctionErrorType = {
  create : {
    errorCode: "CRT001",
    message: "No value was provided for insertion",
  },

  get : null,
  getById : null,
  update : null,
  updateById : null,
  delete : null,

  deleteById : {
    errorCode: "DBI001",
    message: "No id was provided in order to delete an entity or the entity was not found",
  },
};
