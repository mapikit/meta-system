export class SchemaNotFoundError extends Error {
  constructor (schema : string) {
    super(`Schema "${schema}" was not found`);
  }
}
