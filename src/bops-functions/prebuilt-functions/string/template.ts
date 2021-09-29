import { InternalMetaFunction } from "../../internal-meta-function";

export const stringTemplateFunction = (input : { template : string; replacers : Record<string, string> })
: unknown => {
  let result = input.template;
  let [head, tail] = [result.indexOf("${"), result.indexOf("}")];
  while ((tail/head) > 1) {
    const replacer = result.slice(head+2, tail);
    result = result.replace("${" + replacer + "}", input.replacers[replacer] ?? "");
    [head, tail] = [result.indexOf("${"), result.indexOf("}")];
  };
  return ({ result });
};

export const stringTemplateFunctionInformation : InternalMetaFunction = {
  functionName: "stringTemplate",
  version: "1.0.0",
  description: "Replaces the values of a string template with the corresponding given values",
  inputParameters: {
    template: { type: "string", required: true },
    replacers: { type: "object", required: true, subtype: "string" },
  },
  outputData: {
    result: { type: "string", required: true },
  },
};
