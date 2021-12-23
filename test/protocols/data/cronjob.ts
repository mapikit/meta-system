import { ProtocolConfigType } from "../../../src/configuration/protocols/protocols-type";

export const cronjobPeriod = 100;
export const cronjobProtocol : ProtocolConfigType = {
  configuration: {
    bopsName: "cronjob-bop",
    periodMillis: cronjobPeriod,
    arguments: {},
  },
  protocol: "cronjob-protocol",
  identifier: "someIdentifier",
  protocolVersion: "latest",
};
