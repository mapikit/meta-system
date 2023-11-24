import { ConfigurationDiff } from "./configuration-diff-type.js";
import { ConfigurationType } from "../../index.js";

export class DiffManager {
  public readonly diffs : ConfigurationDiff[] = [];
  /** Stores the whole systemState at a checkpoint */
  public readonly systemDiffStates : Map<string, ConfigurationType> = new Map();
  public readonly checkpoints : Map<string, number> = new Map();
  public readonly diffsByAction = [];
  /** a hash for an entity state + checkpoint */
  private readonly stateHashes : Map<[string, string], unknown> = new Map();

  public addDiff (diff : ConfigurationDiff) : void {
    this.diffs.push(diff);
  }

  public addCheckpoint (identifier : string) : void {
    this.checkpoints.set(identifier, this.diffs.length);
  }

  /** Adds many diffs from a single entity diff check
   * @WARNING don't group different entity checks!!!!
   */
  public addManyDiffsFromCheck (diffs : ConfigurationDiff[]) : void {
    diffs.forEach(diff => {
      this.addDiff(diff);
    });
  }

  public getDiffsUpToCheckpoint (identifier : string) : ConfigurationDiff[] {
    const index = this.checkpoints.get(identifier);
    return this.diffs.slice(0, index);
  }
}
