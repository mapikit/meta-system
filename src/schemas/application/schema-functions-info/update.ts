import { InternalMetaFunction } from "bops-functions/internal-meta-function";

export const updateInfo : InternalMetaFunction = {
  functionName: "update",
  description: "Updates all entities in the database, filtering by the properties given",
  author: "mapikit",
  version: "0.0.1",
  inputParameters: {
    query: { type: "cloudedObject", required: true },
    valuesToUpdate: { type: "cloudedObject", required: true },
  },
  outputData: {
    updateError: { type: "$errorMessage", required: false },
    updatedCount: { type: "number", required: false },
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
