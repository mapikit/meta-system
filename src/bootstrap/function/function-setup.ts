import { BopsEngine } from "@api/bops-functions/bops-engine/bops-engine";
import { ModuleManager } from "@api/bops-functions/bops-engine/modules-manager";
import { StaticSystemInfo } from "@api/bops-functions/bops-engine/static-info-validation";
import { BopsManagerClass } from "@api/bops-functions/function-managers/bops-manager";
import { ExternalFunctionManagerClass } from "@api/bops-functions/function-managers/external-function-manager";
import { FunctionManager } from "@api/bops-functions/function-managers/function-manager";
import { InternalFunctionManagerClass } from "@api/bops-functions/function-managers/internal-function-manager";
import { BusinessOperation } from "@api/configuration/business-operations/business-operation";
import { BopsDependencies, CheckBopsFunctionsDependencies }
  from "@api/configuration/business-operations/check-bops-functions-dependencies";
import { ConfigurationType } from "@api/configuration/configuration-type";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { MongoClient } from "mongodb";

export class FunctionSetup {
  private readonly bopsManager = new BopsManagerClass();
  private bopsEngine : BopsEngine;
  private bopsDependencyCheck : CheckBopsFunctionsDependencies[] = [];

  public constructor (
    private internalFunctionManager : InternalFunctionManagerClass,
    private externalFunctionManager : ExternalFunctionManagerClass,
    private systemConfiguration : ConfigurationType,
  ) { }

  // eslint-disable-next-line max-lines-per-function
  public async setup () : Promise<void> {
    const allBopsDependencies : BopsDependencies[] = this.extractAllDependencies();
    this.checkInternalDependencies();
    this.checkSchemaDependencies();

    await this.bootstrapExternalDependencies(allBopsDependencies);
    this.checkExternalDependencies();

    const moduleManager = new ModuleManager({
      ExternalFunctionManager: this.externalFunctionManager,
      InternalFunctionManager: this.internalFunctionManager,
      BopsManager: this.bopsManager,
      SchemasManager: this.createSchemasManager(),
    });

    const mappedConstants = StaticSystemInfo.validateSystemStaticInfo(this.systemConfiguration);

    this.bopsEngine = new BopsEngine({
      MappedConstants: mappedConstants,
      MappedFunctions: await moduleManager.resolveSystemModules(this.systemConfiguration),
    });

    // Start BOps build pipeline:
    // - Try to build bops with no unmet BOps dependencies
    // - Now Check bops that already has BOps dependencies met and build them
    // - Loop until all bops built
  }

  // eslint-disable-next-line max-lines-per-function
  private extractAllDependencies () : BopsDependencies[] {
    const result = [];

    const domainBops = this.systemConfiguration.businessOperations
      .map((bopsConfig) => new BusinessOperation(bopsConfig));

    this.systemConfiguration.businessOperations.forEach((bopsConfig) => {
      const dependencyCheck = new CheckBopsFunctionsDependencies(
        this.systemConfiguration.schemas,
        domainBops,
        new BusinessOperation(bopsConfig),
        this.externalFunctionManager,
        this.internalFunctionManager,
      );

      this.bopsDependencyCheck.push(dependencyCheck);

      result.push(dependencyCheck.bopsDependencies);
    });

    return result;
  }

  private checkInternalDependencies () : void {
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkInternalFunctionsDependenciesMet();

      if (!result) {
        throw Error(`Unmet internal dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  private checkExternalDependencies () : void {
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkExternalRequiredFunctionsMet();

      if (!result) {
        throw Error(`Unmet External dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  private checkSchemaDependencies () : void {
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkSchemaFunctionsDependenciesMet();

      if (!result) {
        throw Error(`Unmet Schema dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  private async bootstrapExternalDependencies (allBopsDependencies : BopsDependencies[]) : Promise<void> {
    const externalDependenciesArray = allBopsDependencies
      .map((bopDependencies) => bopDependencies.external);

    const externalDependencies = externalDependenciesArray.reduce((previousValue, currentValue) => {
      const currentDependency = previousValue;
      currentValue.forEach((value) => currentDependency.push(value));

      return currentDependency;
    });

    for (const dependency of externalDependencies) {
      const exists = this.externalFunctionManager.functionIsInstalled(dependency.name, dependency.version);

      if (!exists) {
        await this.externalFunctionManager.add(dependency.name, dependency.version);
      }
    }
  }

  private createSchemasManager () : SchemasManager {
    const dbConnection = new MongoClient(
      this.systemConfiguration.dbConnectionString,
      {
        useUnifiedTopology: true,
      },
    );

    return new SchemasManager(
      this.systemConfiguration.name,
      dbConnection,
    );
  }

  public getBopsManager () : FunctionManager {
    return this.bopsManager;
  }
}
