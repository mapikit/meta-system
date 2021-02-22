import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";

export type SchemaFunctionErrorType = {
  [key in SchemasFunctions] : {
    [errorName : string ] : {
      errorCode : string;
      message : string;
    };
  }
}

const CreateErrors = {
  nullInput: {
    errorCode: "CRT001",
    message: "No value was provided for insertion",
  },
};

const DeleteByIdErrors = {
  nullInput: {
    errorCode: "DBI001",
    message: "No Id was Provided for deletion",
  },
  notFound: {
    errorCode: "DBI002",
    message: "No entity was found with given Id",
  },
};

export const SchemaFunctionErrors : SchemaFunctionErrorType = {
  create : CreateErrors,

  get : null,
  getById : null,
  update : null,
  updateById : null,
  delete : null,

  deleteById : DeleteByIdErrors,
};
