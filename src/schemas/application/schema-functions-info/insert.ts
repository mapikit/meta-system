import { InternalMetaFunction } from "bops-functions/internal-meta-function";

export const createInfo : InternalMetaFunction = {
  functionName: "insert",
  description: "Inserts the given entity in the database",
  author: "mapikit",
  version: "0.0.1",
  input: {
    entity: { type: "%entity", required: true },
  },
  output: {
    createError: { type: "$errorMessage", required: false },
    createdEntity: { type: "%entity", required: false },
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
