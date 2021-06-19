import {
  availableProtocols,
  ProtocolConfigurations,
} from "@api/configuration/protocols/available-protocols-enum";


export interface ProtocolConfigType {
  protocolType : availableProtocols;
  configuration : ProtocolConfigurations;
}
