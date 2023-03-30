import { CloudedObject } from "../../common/types/clouded-object.js";
import { ProtocolConfigType, ProtocolKind } from "./protocols-type.js";

export class Protocol implements ProtocolConfigType {
  public protocol : string;
  public protocolVersion : string;
  public configuration : CloudedObject;
  public protocolKind : ProtocolKind;
  public identifier : string;

  constructor (protocol : ProtocolConfigType) {
    this.protocolVersion = protocol.protocolVersion;
    this.protocol = protocol.protocol;
    this.configuration = protocol.configuration;
    this.protocolKind = protocol.protocolKind ?? ProtocolKind.normal;
    this.identifier = protocol.identifier;
  }

  public get isDbProtocol () : boolean {
    return this.protocolKind === ProtocolKind.dbProtocol;
  }
};
