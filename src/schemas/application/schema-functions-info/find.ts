import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";

export const getInfo : InternalMetaFunction = {
  functionName: "find",
  description: "Gets an entity from the database by the properties given",
  author: "mapikit",
  version: "0.0.1",
  input: {
    query: { type: "cloudedObject", required: true },
    limit: { type: "number", required: false },
    offset: { type: "number", required: false },
  },
  output: {
    success: { type: "boolean", required: true },
    data: { type: "array", required: true, subtype: "%entity" },
    pages: { type: "number", required: false },
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
