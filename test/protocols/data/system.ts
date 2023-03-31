import { ConfigurationType } from "../../../src/index.js";
import { cronjobProtocol } from "./cronjob.js";
import { cronjobBop } from "./protocol-bop.js";

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
