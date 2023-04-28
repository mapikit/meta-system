import { MetaFunction } from "@meta-system/meta-function-helper";

export const deleteByIdInfo : MetaFunction = {
  functionName: "deleteById",
  description: "Deletes the entity associated with the given Id",
  author: "mapikit",
  input: {
    id: { type: "string", required: true },
  },
  output: {
    success: { type: "boolean", required: true },
  },
  entrypoint: "index.ts",
  mainFunction: "main",
  customTypes: [],
};
