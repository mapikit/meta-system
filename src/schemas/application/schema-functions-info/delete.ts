import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";

export const deleteInfo : InternalMetaFunction = {
  functionName: "delete",
  description: "Deletes all entities in the database, filtering by the properties given",
  author: "mapikit",
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
