export class ProvidedFunctionNotFound extends Error {
  constructor (functionName : string) {
    super(`Function ${functionName} was not found in provided functions`);
  }
}
