import { OperationNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/operation-not-found-error";
import { SchemaNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/schema-not-found-error";
import { ModuleResolverOutput, ModuleResolverType } from "@api/bops-functions/bops-engine/module-types";
import { schemaFunctionsConfig } from "@api/bops-functions/bops-engine/schema-functions-map";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import MapikitBOps from "@api/bops-functions/bops-engine/prebuilt-functions-map";
import { ModuleKind } from "@api/bops-functions/installation/functions-installer";
import { ProvidedFunctionNotFound } from "@api/bops-functions/bops-engine/engine-errors/function-not-found";


export const moduleResolver : ModuleResolverType = {
  "@": async (input) : Promise<ModuleResolverOutput> => {
    const [schema, operation] = input.moduleName.split("@");
    if(!Object.keys(SchemasFunctions).includes(operation)) throw new OperationNotFoundError(operation, schema);

    const operationOutput = schemaFunctionsConfig.get(operation).outputData;
    const schemaToLook = input.schemasManager.schemas.get(schema);
    if(!schemaToLook) throw new SchemaNotFoundError(schema);

    return {
      main: schemaToLook.bopsFunctions[operation],
      outputData: operationOutput,
    };
  },

  "#" : async (input) : Promise<ModuleResolverOutput> => {
    const foundFunction = MapikitBOps.get(input.moduleName);
    if(!foundFunction) throw new ProvidedFunctionNotFound(input.moduleName);
    return {
      main: foundFunction.main,
      outputData: foundFunction.outputData,
    };
  },

  "%" : async (input) : Promise<ModuleResolverOutput> => {
    await input.fileManager.installer.install(input.moduleName, input.moduleVersion, ModuleKind.NPM);
    const functionJson = await input.fileManager.externalFunctions.getFunctionDescriptionFile(input.moduleName);
    const externalFunctionConfig = JSON.parse(functionJson);
    const mainFunction = await input.fileManager.externalFunctions.importMain(
      input.moduleName,
      externalFunctionConfig.entrypoint,
      externalFunctionConfig.mainFunction,
    );
    return {
      main: mainFunction,
      outputData: externalFunctionConfig.outputData,
    };
  },
};
