/* eslint-disable max-len */
import "module-alias/register";
import { ConfigurationType } from "@api/configuration-de-serializer/domain/configuration-type";
import { mapikitProvidedBop } from "@test/bops-functions/bops-engine/test-data/business-operations/mapikit-provided-bop";
import { schemaFunctionsBop } from "@test/bops-functions/bops-engine/test-data/business-operations/schema-functions-bop";
import { externalFunctionsBop } from "@test/bops-functions/bops-engine/test-data/business-operations/external-functions";
import { mixedFunctionsBop } from "@test/bops-functions/bops-engine/test-data/business-operations/mixed-functions";

export const testSystem : ConfigurationType = {
  name: "test-system",
  version: "0.0.1",
  port: 8080,
  envs: [],
  schemas: [
    {
      name: "car",
      format: {
        model: { type: "string" },
        year: { type: "string" },
      },
      routes: {
        getMethodEnabled: true,
        postMethodEnabled: true,
        deleteMethodEnabled: true,
        patchMethodEnabled: true,
        putMethodEnabled: true,
        queryParamsGetEnabled: true,
      },
    },
  ],
  dbConnectionString: "mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/?authSource=admin",
  businessOperations: [
    schemaFunctionsBop,
    mapikitProvidedBop,
    externalFunctionsBop,
    mixedFunctionsBop,
  ],
};

