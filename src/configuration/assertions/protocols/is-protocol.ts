import { ProtocolConfigType } from "../../protocols/protocols-type";
import { isType, optionalIsType } from "../is-type";

const requiredProtocolsKeys : (keyof ProtocolConfigType)[] = [
  "configuration",
  "protocol",
  "identifier",
];

export function isProtocol (input : unknown) : asserts input is ProtocolConfigType {
  if (typeof input !== "object") {
    throw new Error("Protocol with incorrect format found: Not an object");
  }

  const inputKeys = Object.keys(input);

  requiredProtocolsKeys.forEach((requiredKey) => {
    if (!inputKeys.includes(requiredKey)) {
      throw new Error(`Protocol with incorrect format found: Missing key "${requiredKey}"`);
    }
  });

  const protocolInput = input as ProtocolConfigType;

  optionalIsType("string", "Protocol version with incorrect format", protocolInput.protocolVersion);
  isType("string", "Protocol type with incorrect format", protocolInput.protocol);
  isType("object", "Protocol configuration with incorrect format", protocolInput.configuration);
};
