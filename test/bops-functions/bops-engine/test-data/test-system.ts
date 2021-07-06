import { mapikitProvidedBop } from "../test-data/business-operations/prebuilt-bop";
import { ConfigurationType } from "../../../../src/configuration/configuration-type";
import { internalBop } from "./business-operations/internal-bop";
import { schemaBop } from "./business-operations/schema-bop";
import { externalBop } from "./business-operations/external-bop";
import { availableProtocolsNames } from "../../../../src/configuration/protocols/available-protocols-enum";

export const testSystem : ConfigurationType = {
  name: "test-system",
  version: "0.0.1",
  envs: [],
  schemas: [
    {
      name: "car",
      format: {
        model: { type: "string" },
        year: { type: "string" },
      },
    },
  ],
  dbConnectionString: "mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/?authSource=admin",
  businessOperations: [
    mapikitProvidedBop,
    internalBop,
    schemaBop,
    externalBop,
  ],
  protocols: [
    {
      protocolType: availableProtocolsNames.HTTP_JSONBODY,
      configuration: {
        port: 8080,
        routes: [],
      },
    },
  ],
};

