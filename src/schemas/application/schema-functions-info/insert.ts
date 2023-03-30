import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";

export const createInfo : InternalMetaFunction = {
  functionName: "insert",
  description: "Inserts the given entity in the database",
  author: "mapikit",
  version: "0.0.1",
  input: {
    entity: { type: "%entity", required: true },
  },
  output: {
    success: { type: "boolean", required: true },
    insertedId: { type: "string", required: false },
  },
  customTypes: [],
};
