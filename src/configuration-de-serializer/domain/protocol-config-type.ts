import {
  availableProtocols,
  ProtocolConfigurations,
} from "@api/configuration-de-serializer/protocols/available-protocols-enum";


export interface ProtocolConfigType {
  protocolType : availableProtocols;
  configuration : ProtocolConfigurations;
}
