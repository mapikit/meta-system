import { SchemasFunctions } from "./schemas-functions.js";

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
  nullInput: {
    errorCode: "GBI001",
    message: "No value for the ID search was provided",
  },
};

const UpdateByIdErrors = {
  nullInput: {
    errorCode: "UBI001",
    message: "No valid ID was provided for updating the entity",
  },
  notFound: {
    errorCode: "UBI002",
    message: "No entity was found for the provided ID",
  },
  genericError: {
    errorCode: "UBI003",
    message: "A unmapped error has happened. This possibly means that" +
      " some configuration in the server was off, or the communication channel was shut down.",
  },
};

const GetErrors = {
  invalidSearchArgument: {
    errorCode: "G001",
    message: "Invalid Search Argument",
  },
  genericError: {
    errorCode: "G002",
    message: "A unmapped error has happened. This possibly means that" +
      " some configuration in the server was off, or the communication channel was shut down.",
  },
};

const UpdateErrors = {
  invalidQueryArgument: {
    errorCode: "U001",
    message: "Invalid Query Argument",
  },
  genericError: {
    errorCode: "U002",
    message: "A unmapped error has happened. This possibly means that" +
      " some configuration in the server was off, or the communication channel was shut down.",
  },
};

const DeleteErrors = {
  invalidQueryArgument: {
    errorCode: "D001",
    message: "Invalid Query Argument",
  },
  genericError: {
    errorCode: "D002",
    message: "A unmapped error has happened. This possibly means that" +
      " some configuration in the server was off, or the communication channel was shut down.",
  },
};

const CountErrors = {
  invalidQueryArgument: {
    errorCode: "C001",
    message: "Invalid Query Argument",
  },
  genericError: {
    errorCode: "C002",
    message: "A unmapped error has happened. This possibly means that" +
      " some configuration in the server was off, or the communication channel was shut down.",
  },
};

export const SchemaFunctionErrors : SchemaFunctionErrorType = {
  insert : CreateErrors,
  findById : GetByIdErrors,
  deleteById : DeleteByIdErrors,
  updateById : UpdateByIdErrors,
  find : GetErrors,
  update : UpdateErrors,
  delete : DeleteErrors,
  count: CountErrors,
};
