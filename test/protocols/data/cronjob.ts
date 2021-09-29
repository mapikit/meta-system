import { ProtocolConfigType } from "../../../src/configuration/configuration-type";

export const cronjobPeriod = 100;
export const cronjobProtocol : ProtocolConfigType = {
  configuration: {
    bopsName: "cronjob-bop",
    periodMillis: cronjobPeriod,
    arguments: {},
  },
  protocolType: "cronjob-protocol",
  protocolVersion: "latest",
};
