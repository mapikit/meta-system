import "module-alias/register";

import { FunctionSetup } from "@api/bootstrap/function/function-setup";
import internalFunctionManager from "./bops-functions/function-managers/internal-function-manager";
import { externalFunctionManagerSingleton } from "./bops-functions/function-managers/external-function-manager";
import { ConfigurationType } from "./configuration/configuration-type";
import { HTTPJsonBodyProtocol } from "./configuration/protocols/HTTP_JSONBODY/http-jsonbody-protocol";

const sysConfig : ConfigurationType = {
  name: "aluguel",
  dbConnectionString: "",
  schemas: [],
  version: "0.0.1",
  businessOperations: [
    {
      name: "logme",
      input: {},
      output: {},
      constants: [],
      configuration: [
        {
          key: 2,
          moduleRepo: ":bops-function-hello-world",
          version: "1.1.1",
          dependencies: [],
        },
        {
          key: 1,
          moduleRepo: "%output",
          dependencies: [ { origin: 2 } ],
        },
      ],
      customObjects: [],
    },
    {
      name: "pay",
      input: {
        amount: { type: "number" },
      },
      output: {
        paymentAmount: { type: "number" },
      },
      constants: [
        { type: "number", name: "baseValue", value: 499 },
        { type: "number", name: "logThreshold", value: 300 },
      ],
      configuration: [
        {
          key: 2,
          moduleRepo: "#stringToNumber",
          dependencies: [
            { origin: "inputs", originPath: "amount", targetPath: "string" },
          ],
        },
        {
          key: 23,
          moduleRepo: "#subtract",
          dependencies: [
            { origin: 2, originPath: "result.result", targetPath: "B" },
            { origin: "constants", originPath: "baseValue", targetPath: "A" },
          ],
        },
        {
          key: 13,
          moduleRepo: "#higherThan",
          dependencies: [
            { origin: "constants", originPath: "logThreshold", targetPath: "A" },
            { origin: 23, originPath: "result.result", targetPath: "B" },
          ],
        },
        {
          key: 444,
          moduleRepo: "#if",
          dependencies: [
            { origin: 13, originPath: "result.isHigher", targetPath: "boolean" },
            { origin: 12, originPath: "module", targetPath: "ifTrue" },
          ],
        },
        {
          key: 12,
          moduleRepo: "+logme",
          dependencies: [],
        },
        {
          key: 1,
          moduleRepo: "%output",
          dependencies: [
            { origin: 23, originPath: "result.result", targetPath: "remainingValue" },
            { origin: 444 },
          ],
        },
      ],
      customObjects: [],
    },
  ],
};

const functionBootstrap = new FunctionSetup(
  internalFunctionManager,
  externalFunctionManagerSingleton,
  sysConfig,
);

// eslint-disable-next-line max-lines-per-function
const main = async () : Promise<void> => {
  await functionBootstrap.setup();
  const bopsManager = functionBootstrap.getBopsManager();

  new HTTPJsonBodyProtocol({
    port: 8888,
    routes: [
      {
        businessOperation: "pay",
        route: "/pay/:amount",
        method: "GET",
        inputMapConfiguration: [
          { origin: "route", originPath: "amount", targetPath: "amount" },
        ],
        resultMapConfiguration: {
          body: { result: "remainingValue" },
          statusCode: 200,
          headers: [],
        },
      },
    ],
  }, bopsManager).start();
};

main().catch((e) => { throw e; });
