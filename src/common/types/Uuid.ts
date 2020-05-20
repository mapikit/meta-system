import v4 from "uuid/v4";

export class Uuid {
  protected uuid : string;

  public constructor (uuid : string) {
    this.uuid = uuid;
  }

  public static newUuid () : Uuid {
    return new Uuid(v4());
  }

  public get raw () : string {
    return this.uuid;
  }
};
