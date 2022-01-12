import { InternalMetaFunction } from "bops-functions/internal-meta-function";

export const getInfo : InternalMetaFunction = {
  functionName: "find",
  description: "Gets an entity from the database by the properties given",
  author: "mapikit",
  version: "0.0.1",
  input: {
    query: { type: "cloudedObject", required: true },
  },
  output: {
    getError: { type: "$errorMessage", required: false },
    results: { type: "array", required: false, subtype: "%entity" },
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
