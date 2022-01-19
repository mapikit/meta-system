import { InternalMetaFunction } from "bops-functions/internal-meta-function";

export const deleteInfo : InternalMetaFunction = {
  functionName: "delete",
  description: "Deletes all entities in the database, filtering by the properties given",
  author: "mapikit",
  version: "0.0.1",
  input: {
    query : { type: "cloudedObject", required: true },
  },
  output: {
    success: { type: "boolean", required: true },
    affectedEntities: { type: "number", required: false },
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
