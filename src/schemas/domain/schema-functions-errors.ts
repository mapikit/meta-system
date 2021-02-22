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

const GetByIdErrors = {
  nullInput : {
    errorCode: "GBI001",
    message: "No value for the ID search was provided",
  },
};

export const SchemaFunctionErrors : SchemaFunctionErrorType = {
  create : CreateErrors,
  getById : GetByIdErrors,
  deleteById : DeleteByIdErrors,

  get : null,
  update : null,
  updateById : null,
  delete : null,
};
