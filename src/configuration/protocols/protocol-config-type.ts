import { availableProtocolsNames, ProtocolConfigurations } from "./available-protocols-enum";

export interface ProtocolConfigType {
  protocolType : availableProtocolsNames;
  configuration : ProtocolConfigurations;
}
