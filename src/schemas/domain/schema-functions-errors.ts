import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";

export type SchemaFunctionErrorType = {
  [key in SchemasFunctions] : {
    errorCode : string;
    message : string;
  }
}

export const SchemaFunctionErrors : SchemaFunctionErrorType = class {
  public static create = {
    errorCode: "CRT001",
    message: "No value was provided for insertion",
  }

  public static get = null;
  public static getById = null;
  public static update = null;
  public static updateById = null;
  public static delete = null;
  public static deleteById = null;
};
