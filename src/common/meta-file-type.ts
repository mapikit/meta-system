import { ObjectDefinition } from "@meta-system/object-definition";
import { EntityPermissions } from "../broker/entity-broker.js";

export interface MetaFileType {
  name ?: string;
  version ?: string;
  entrypoint : string;
  configurationFormat : ObjectDefinition;
  permissions : EntityPermissions[];
}

export const metaFileObjectDefinition : ObjectDefinition = {
  name: { type: "string", required: false },
  version: { type: "string", required: false },
  entrypoint: { type: "string", required: true },
  configurationFormat: { type: "__%objdef%__", required: true },
  permissions: { type: "array", required: true, subtype: {
    permissions: { type: "array", required: true, subtype: "string" },
    entity: { type: "string", required: true },
  } },
};
