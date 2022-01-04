import { MetaFunction } from "@meta-system/meta-function-helper";

export const deleteByIdInfo : MetaFunction = {
  functionName: "deleteById",
  description: "Deletes the entity associated with the given Id",
  author: "mapikit",
  version: "0.0.1",
  input: {
    id: { type: "string", required: true },
  },
  output: {
    deleteError: { type: "$errorMessage", required: false },
    deleted: { type: "%entity", required: false },
  },
  entrypoint: "index.ts",
  mainFunction: "main",
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
