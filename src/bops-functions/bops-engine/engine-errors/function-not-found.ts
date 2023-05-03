import { BopsConfigurationEntry } from "../../../configuration/business-operations/business-operations-type.js";

export class FunctionNotFoundError extends Error {
  constructor (module : BopsConfigurationEntry) {
    // eslint-disable-next-line max-len
    super(`Function of name "${module.moduleName}" was not found in provided functions! [key: ${module.key}, type: ${module.moduleType}], package: ${module.modulePackage}]`);
    this.name = FunctionNotFoundError.name;
  }
}
