import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";

export const getByIdInfo : InternalMetaFunction = {
  functionName: "findById",
  description: "Gets an entity from the database by the Id",
  author: "mapikit",
  input: {
    id: { type: "string", required: true },
  },
  output: {
    success: { type: "boolean", required: true },
    data: { type: "%entity", required: false },
  },
  customTypes: [],
};
