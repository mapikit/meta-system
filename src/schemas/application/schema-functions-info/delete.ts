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
    deletedCount: { type: "number", required: false },
    deleteError: { type: "$errorMessage", required: false },
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
