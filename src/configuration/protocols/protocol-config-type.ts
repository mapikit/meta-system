import {
  availableProtocolsNames,
  ProtocolConfigurations,
} from "@api/configuration/protocols/available-protocols-enum";


export interface ProtocolConfigType {
  protocolType : availableProtocolsNames;
  configuration : ProtocolConfigurations;
}
