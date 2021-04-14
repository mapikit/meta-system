import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { FunctionsInstaller, ModuleKind } from "@api/bops-functions/installation/functions-installer";
import { BopsConfigurationEntry } from "@api/configuration-de-serializer/domain/business-operations-type";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import { MetaFunction } from "meta-function-helper";
import { schemaFunctionsFolders } from "@api/bops-functions/bops-engine/schema-functions-map";
import {
  MappedFunctions,
  ModuleManagerFileSystem,
  ModuleResolverOutput,
  ModuleResolverType } from "@api/bops-functions/bops-engine/module-types";
import { OperationNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/operation-not-found-error";
import { SchemaNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/schema-not-found-error";
import MapikitBOps from "@api/bops-functions/bops-engine/prebuilt-functions-map";

export class ModuleManager {
  private schemasManager : SchemasManager;
  private files : ModuleManagerFileSystem;

  constructor (options : {
    SchemaManager : SchemasManager;
    FunctionsFolder : string;
    BOpsConfigFile : string;
  }) {
    const schemaFunctionsLocation = "src/schemas/application/schema-bops-funtions";
    this.files = {
      installer : new FunctionsInstaller(options.FunctionsFolder),
      externalFunctions: new FunctionFileSystem(process.cwd(), options.FunctionsFolder, options.BOpsConfigFile),
      schemaFunctions: new FunctionFileSystem(process.cwd(), schemaFunctionsLocation, options.BOpsConfigFile),
    };

    this.schemasManager = options.SchemaManager;
  }

  public async resolveModules (modules : BopsConfigurationEntry[]) : Promise<MappedFunctions> {
    const mappedModules = new Map<string, ModuleResolverOutput>();
    for(const module of modules) {
      if(!mappedModules.get(module.moduleRepo)) {
        const resolvedModule = await moduleResolver[module.moduleRepo[0]]({
          moduleName: module.moduleRepo.slice(1),
          moduleVersion: module.version,
          fileManager: this.files,
          schemasManager: this.schemasManager,
        });
        mappedModules.set(module.moduleRepo, resolvedModule);
      }
    }
    return mappedModules;
  }
}

const moduleResolver : ModuleResolverType = {
  "@": async (input) : Promise<ModuleResolverOutput> => {
    const [schema, operation] = input.moduleName.split("@");
    if(!Object.keys(SchemasFunctions).includes(operation)) throw new OperationNotFoundError(operation, schema);

    const functionLocation = schemaFunctionsFolders.get(operation);
    const metaFunction = await input.fileManager.schemaFunctions.getFunctionDescriptionFile(functionLocation);
    const schemaFunctionConfig = JSON.parse(metaFunction) as MetaFunction;
    const schemaToLook = input.schemasManager.schemas.get(schema);
    if(!schemaToLook) throw new SchemaNotFoundError(schema);

    return {
      main: schemaToLook.bopsFunctions[operation],
      outputData: schemaFunctionConfig.outputData,
    };
  },

  "#" : async (input) : Promise<ModuleResolverOutput> => {
    if(MapikitBOps.get(input.moduleName) === undefined) throw new Error("No such Mapikit Function");
    //TODO improve this to be custom error
    return {
      main: MapikitBOps.get(input.moduleName).main,
      outputData: MapikitBOps.get(input.moduleName).outputData,
    };
  },

  "%" : async (input) : Promise<ModuleResolverOutput> => {
    await input.fileManager.installer.install(input.moduleName, input.moduleVersion, ModuleKind.NPM);
    const functionJson = await input.fileManager.externalFunctions.getFunctionDescriptionFile(input.moduleName);
    const externalFunctionConfig = JSON.parse(functionJson) as MetaFunction;
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


