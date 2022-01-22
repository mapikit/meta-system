import { ConfigurationType } from "../../../src";
import { cronjobProtocol } from "./cronjob";
import { cronjobBop } from "./protocol-bop";

export const testSystem : ConfigurationType = {
  name: "test-system",
  version: "0.0.1",
  envs: [],
  schemas: [],
  businessOperations: [
    cronjobBop,
  ],
  protocols: [
    cronjobProtocol,
  ],
};
