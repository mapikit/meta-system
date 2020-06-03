import { validate, ValidationError } from "class-validator";

export async function isValidClass<T> (toBeValidated : T) : Promise<ValidationError[]> {
  return validate(toBeValidated);
}
