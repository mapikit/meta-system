import { availableProtocolsNames } from "src/configuration/protocols/available-protocols-enum";
import { HTTPJsonBodyProtocol } from "src/configuration/protocols/HTTP_JSONBODY/http-jsonbody-protocol";

export const protocolClassesMap : Record<availableProtocolsNames, new (...args : unknown[]) => unknown> = {
  "HTTP_JSONBODY": HTTPJsonBodyProtocol,
};
