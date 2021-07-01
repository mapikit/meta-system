import "module-alias/register";

import { FunctionSetup } from "@api/bootstrap/function/function-setup";
import internalFunctionManager from "./bops-functions/function-managers/internal-function-manager";
import { externalFunctionManagerSingleton } from "./bops-functions/function-managers/external-function-manager";
import { ConfigurationType } from "./configuration/configuration-type";
import { HTTPJsonBodyProtocol } from "./configuration/protocols/HTTP_JSONBODY/http-jsonbody-protocol";

const sysConfig : ConfigurationType = {
  name: "aluguel",
  dbConnectionString: "mongodb://api-development:apipass@localhost:27017",
  schemas: [
    {
      name: "failedPayment",
      format: {
        amount: { type: "number" },
        date: { type: "date" },
      },
    },
  ],
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
        remainingValue: { type: "number" },
        stausCode: { type: "number" },
        message: { type: "string" },
      },
      constants: [
        { type: "number", name: "baseValue", value: 499 },
        { type: "number", name: "logThreshold", value: 300 },
        { type: "string", name: "failMessage", value: "Not enough paid" },
        { type: "string", name: "successMessage", value: "Paid" },
        { type: "number", name: "failCode", value: 412 },
        { type: "number", name: "successCode", value: 200 },
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
            { origin: 28, originPath: "module", targetPath: "ifFalse" },
          ],
        },
        {
          key: 28,
          moduleRepo: "@failedPayment@create",
          dependencies: [
            { origin: 2, originPath: "result.result", targetPath: "entity.amount" },
            { origin: 29, originPath: "result.now", targetPath: "entity.date" },
          ],
        },
        {
          key: 29,
          moduleRepo: "#dateNow",
          dependencies: [],
        },
        {
          key: 12,
          moduleRepo: "+logme",
          dependencies: [],
        },
        {
          key: 99,
          moduleRepo: "#if",
          dependencies: [
            { origin: 13, originPath: "result.isHigher", targetPath: "boolean" },
            { origin: "constants", originPath: "successCode", targetPath: "ifTrue" },
            { origin: "constants", originPath: "failCode", targetPath: "ifFalse" },
          ],
        },
        {
          key: 100,
          moduleRepo: "#if",
          dependencies: [
            { origin: 13, originPath: "result.isHigher", targetPath: "boolean" },
            { origin: "constants", originPath: "successMessage", targetPath: "ifTrue" },
            { origin: "constants", originPath: "failMessage", targetPath: "ifFalse" },
          ],
        },
        {
          key: 1,
          moduleRepo: "%output",
          dependencies: [
            { origin: 23, originPath: "result.result", targetPath: "remainingValue" },
            { origin: 99, originPath: "result.outputValue", targetPath: "statusCode" },
            { origin: 100, originPath: "result.outputValue", targetPath: "message" },
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
          body: { result: "remainingValue", message: "message" },
          statusCode: "statusCode",
          headers: [],
        },
      },
    ],
  }, bopsManager).start();
};

main().catch((e) => { throw e; });
