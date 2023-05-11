import { ObjectDefinition } from "@meta-system/object-definition";
import { EntityPermissions } from "../broker/entity-broker.js";

export interface MetaFileType {
  name ?: string;
  version ?: string;
  entrypoint : string;
  configurationFormat : ObjectDefinition;
  permissions : EntityPermissions[];
}
