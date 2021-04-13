import { ConstantTypeError } from "@api/bops-functions/bops-engine/engine-errors/constant-type-error";
import { JsonTypes } from "@api/common/types/json-types";
import { BopsConstant, JsonTypeDict } from "@api/configuration-de-serializer/domain/business-operations-type";

export type MappedConstants = Map<string, JsonTypeDict<JsonTypes>>;

export function validateConstants (constants : BopsConstant[]) : MappedConstants {
  const resolvedConstants = new Map<string, JsonTypeDict<JsonTypes>>();
  constants.forEach(constant => {
    if(typeof constant.value !== constant.type) throw new ConstantTypeError(constant); //TODO improve error
    resolvedConstants.set(constant.name, constant.value);
  });
  Object.freeze(resolvedConstants);
  return resolvedConstants;
}
