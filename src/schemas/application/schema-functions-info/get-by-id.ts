import { InternalMetaFunction } from "bops-functions/internal-meta-function";

export const getByIdInfo : InternalMetaFunction = {
  functionName: "getById",
  description: "Gets an entity from the database by the Id",
  author: "mapikit",
  version: "0.0.1",
  inputParameters: {
    id: { type: "string", required: true },
  },
  outputData: {
    entity: { type: "%entity", required: false },
    found: { type: "boolean", required: true },
    getError: { type: "$errorMessage", required: false },
  },
  customTypes: [
    {
      name: "errorMessage",
      type: {
        message: { type: "string" },
        errorCode: { type: "string" },
      },
    },
  ],
};
