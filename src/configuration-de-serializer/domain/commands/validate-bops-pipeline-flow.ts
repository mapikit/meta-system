import { BusinessOperation } from "@api/configuration-de-serializer/domain/business-operation";
import { BopsConfigurationEntry } from "@api/configuration-de-serializer/domain/business-operations-type";

export class ValidateBopsPipelineFlowCommand {
  private businessOperation : BusinessOperation;
  private functions : Map<number, BopsConfigurationEntry> = new Map();
  private mappedPaths : number[][] = [];

  public execute (businessOperation : BusinessOperation) : void {
    this. businessOperation = businessOperation;

    this.extractModules();
    this.validateKeys();
    this.mapFunctionPipelinePath(
      this.functions.get(1),
      [],
    );
  }

  private extractModules () : void {
    this.businessOperation.configuration.forEach((configurationEntry) => {
      this.functions.set(configurationEntry.key, configurationEntry);
    });
  }

  // All keys should be positive greater than 0 integers
  // There should be a key to start the sequence at the value "1"
  private validateKeys () : void {
    let startKeyExists = false;

    this.functions.forEach((module) => {
      if (module.key <= 0) {
        throw Error(`Invalid Key Index @ BOPS ${this.businessOperation.name} - Repository ${module.moduleRepo}`);
      }

      if (module.key === 1) {
        startKeyExists = true;
      }
    });

    if (!startKeyExists) {
      throw Error(`No starting key to the pipeline of BOPS ${this.businessOperation.name}`);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private mapFunctionPipelinePath (
    currentFunction : BopsConfigurationEntry, currentPath : number[], nextFunctionPointer = 0,
  ) : number[] {
    const path = [...currentPath];

    if (path.includes(currentFunction.key)) {
      throw Error(`Duplicated entry in one the branches of the configuration for BOPS ${this.businessOperation.name}`);
    }

    path.push(currentFunction.key);

    const isEndingNode = currentFunction.moduleRepo.charAt(0) === "%";
    if (isEndingNode) {
      this.mappedPaths.push(path);
      return path;
    }

    if (currentFunction.nextFunctions.length === 1) {
      const next = this.functions.get(currentFunction.nextFunctions[nextFunctionPointer].nextKey);

      if (!next) {
        throw Error(`Unmapped next modules found at BOPS ${this.businessOperation.name}`);
      }

      return this.mapFunctionPipelinePath(next, path);
    }

    currentFunction.nextFunctions.forEach((nextFunctionPath) => {
      const next = this.functions.get(nextFunctionPath.nextKey);

      if (!next) {
        throw Error(`Unmapped next modules found at BOPS ${this.businessOperation.name}`);
      }

      return this.mapFunctionPipelinePath(next, path);
    });
  }
}
