export class OperationNotFoundError extends Error {
  constructor (operation : string, schema : string) {
    super(`"${operation}", required for schema ${schema} is not a valid database operation`);
    this.name = OperationNotFoundError.name;
  }
}
