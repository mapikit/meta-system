type PossibleTypes = "string" | "boolean" | "number" | "object";

export function isType <T> (type : PossibleTypes, message : string, input : unknown) : asserts input is  T {
  if(typeof input !== type) {
    throw Error(`${message}: Not type ${type} - Type is ${typeof input}`);
  }
}

export function optionalIsType <T> (type : PossibleTypes, message : string, input : unknown) : asserts input is T {
  if(input !== undefined) isType<T>(type, message, input);
}
