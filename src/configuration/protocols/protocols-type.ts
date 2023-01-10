import { CloudedObject } from "../../common/types/clouded-object";

export interface ProtocolConfigType {
  protocol : string;
  protocolVersion : string; // SemVer;
  configuration : CloudedObject;
  protocolKind ?: ProtocolKind;
  identifier : string;
}

export enum ProtocolKind {
  normal = "normal",
  dbProtocol = "dbProtocol",
}