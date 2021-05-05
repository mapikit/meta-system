export class InternalBopNotFound extends Error {
  constructor (internalBopName : string) {
    super(`"${internalBopName}", required as an internal Bop, was not found in the system config`);
    this.name = InternalBopNotFound.name;
  }
}
