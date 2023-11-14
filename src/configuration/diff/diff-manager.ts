import { ConfigurationDiff } from "./configuration-diff-type.js";

export class DiffManager {
  public readonly diffs : ConfigurationDiff[] = [];

  public addDiff (diff : ConfigurationDiff) : void {
    this.diffs.push(diff);
  }
}
