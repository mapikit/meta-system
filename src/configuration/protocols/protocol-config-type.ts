import { CloudedObject } from "common/types/clouded-object";

export interface ProtocolConfigType {
  protocolType : string;
  protocolVersion : string; // SemVer;
  configuration : CloudedObject;
}
