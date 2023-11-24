import { ConfigurationDiff } from "./configuration-diff-type.js";

export class DiffManager {
  public readonly diffs : ConfigurationDiff[] = [];
  public readonly checkpoints : Map<string, number> = new Map();

  public addDiff (diff : ConfigurationDiff) : void {
    this.diffs.push(diff);
  }

  public addCheckpoint (identifier : string) : void {
    this.checkpoints.set(identifier, this.diffs.length);
  }

  public addManyDiffs (diffs : ConfigurationDiff[]) : void {
    diffs.forEach(diff => this.addDiff(diff));
  }

  public getUpToCheckpoint (identifier : string) : ConfigurationDiff[] {
    const index = this.checkpoints.get(identifier);
    return this.diffs.slice(0, index);
  }
}
