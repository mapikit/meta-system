import { ProtocolConfigType } from "../../protocols/protocols-type.js";
import { isType, optionalIsType } from "../is-type.js";

const requiredProtocolsKeys : (keyof ProtocolConfigType)[] = [
  "configuration",
  "protocol",
  "identifier",
  "protocolKind",
];

const allowedProtocolTypes = [ "dbProtocol", "normal" ];

// eslint-disable-next-line max-lines-per-function
export function isProtocol (input : unknown) : asserts input is ProtocolConfigType {
  if (typeof input !== "object") throw new Error("Protocol with incorrect format found: Not an object");


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

  if(!allowedProtocolTypes.includes(protocolInput.protocolKind)) {
    throw Error(`Invalid protocol kind "${protocolInput.protocolKind}".\n`+
    `\t - Valid kinds are ${allowedProtocolTypes.join(", ")}`);
  }
};
