import { CloudedObject } from "../../common/types/clouded-object";
import { ProtocolConfigType } from "./protocols-type";

export class Protocol implements ProtocolConfigType {
  public protocolType : string;
  public protocolVersion : string;
  public configuration : CloudedObject;

  constructor (protocol : ProtocolConfigType) {
    this.protocolVersion = protocol.protocolVersion;
    this.protocolType = protocol.protocolType;
    this.configuration = protocol.configuration;
  }
};
