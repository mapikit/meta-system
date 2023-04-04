
import { isValidType } from "../../common/assertions/is-valid-type.js";
import { BopsConstant, ExtendedJsonTypeDict } from
  "../../configuration/business-operations/business-operations-type.js";
import { ConfigurationType } from "../../configuration/configuration-type.js";
import { ConstantTypeError } from "./engine-errors/constant-type-error.js";

export type ResolvedConstants = Record<string, unknown>;
/**
 * This class is responsible for gathering and validating all the static, immutable, info; such
 * as constants and internalBops
 */
export class StaticSystemInfo {
  private static validateConstant (constant : BopsConstant) : ExtendedJsonTypeDict {
    if(!isValidType(constant.value, constant.type)) throw new ConstantTypeError(constant);
    return constant.value;
  }

  private static validateConstants (constants : BopsConstant[]) : ResolvedConstants {
    const resolvedConstants = {};
    constants.forEach(constant => {
      resolvedConstants[constant.name] = this.validateConstant(constant);
    });
    return resolvedConstants;
  }

  public static validateSystemStaticInfo (systemConfig : ConfigurationType)
    : Record<string, ResolvedConstants> {
    const bops = systemConfig.businessOperations;
    const allSystemConstants : Record<string, ResolvedConstants> = {};
    bops.forEach(bop => {
      allSystemConstants[bop.name] = this.validateConstants(bop.constants);
    });
    return Object.freeze(allSystemConstants);
  }
}
