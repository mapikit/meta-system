import { BopsConstant } from "../../../configuration/business-operations/business-operations-type.js";

export class ConstantTypeError extends Error {
  constructor (constant : BopsConstant) {
    super(`The constant "${constant.name}" was expected to be a ${constant.type}` +
      ` but ${constant.value} type is ${typeof constant.value}`);
    this.name = ConstantTypeError.name;
  }
}
