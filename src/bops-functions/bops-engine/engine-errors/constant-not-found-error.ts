export class ConstantNotFoundError extends Error {
  constructor (constantName : string, target : string) {
    super(`Constant ${constantName} was required for target "${target}" but not provided`);
  }
}
