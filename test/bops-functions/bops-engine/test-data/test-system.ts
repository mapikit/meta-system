import { mapikitProvidedBop } from "../test-data/business-operations/prebuilt-bop.js";
import { ConfigurationType } from "../../../../src/configuration/configuration-type.js";
import { internalBop } from "./business-operations/internal-bop.js";
import { schemaBop } from "./business-operations/schema-bop.js";
import { externalBop } from "./business-operations/external-bop.js";
import { variableBop } from "./business-operations/variables-bop.js";
import { packageBop } from "./business-operations/package-bop.js";
import { envBop } from "./business-operations/envs-bop.js";

export const testSystem : ConfigurationType = {
  name: "test-system",
  version: "0.0.1",
  envs: [
    { key: "testEnv", value: "test" },
  ],
  schemas: [
    {
      name: "car",
      format: {
        model: { type: "string" },
        year: { type: "string" },
      },
      identifier: "3993",
    },
  ],
  businessOperations: [
    mapikitProvidedBop,
    internalBop,
    schemaBop,
    externalBop,
    variableBop,
    packageBop,
    envBop,
  ],
  addons: [],
};

