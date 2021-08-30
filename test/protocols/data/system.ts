import { ConfigurationType } from "../../../src";
import { cronjobProtocol } from "./cronjob";
import { cronjobBop } from "./protocol-bop";

export const testSystem : ConfigurationType = {
  name: "test-system",
  version: "0.0.1",
  envs: [],
  schemas: [],
  dbConnectionString: "mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/?authSource=admin",
  businessOperations: [
    cronjobBop,
  ],
  protocols: [
    cronjobProtocol,
  ],
};
