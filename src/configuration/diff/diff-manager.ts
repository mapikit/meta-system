import { ConfigurationDiff, EntityType } from "./configuration-diff-type.js";
import { ConfigurationType } from "../../index.js";

type EntityQuery = {
  entityType : EntityType;
  identifier : string;
}

type DiffWithHash = ConfigurationDiff & { entityHash : string };

export class DiffManager {
  public readonly diffs : DiffWithHash[] = [];
  /** Stores the whole systemState at a checkpoint */
  public readonly systemDiffStates : Map<string, ConfigurationType> = new Map();
  public readonly checkpoints : Map<string, number> = new Map();
  public readonly diffsByAction = [];
  private readonly hashSeparator = "_-@$.$@-_"; // because yes

  public constructor () {
    this.toDiffWithHash = this.toDiffWithHash.bind(this);
  }

  public addDiff (diff : ConfigurationDiff) : void {
    this.diffs.push(this.toDiffWithHash(diff));
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

  public getDiffsUpToCheckpoint (identifier : string) : DiffWithHash[] {
    const index = this.checkpoints.get(identifier);
    return this.diffs.slice(0, index);
  }

  public queryDiffs (query : { entity ?: EntityQuery, checkpoint ?: string }) : ConfigurationDiff[] {
    let usedDiffs : DiffWithHash[] = [];
    if (query.checkpoint) { usedDiffs = this.getDiffsUpToCheckpoint(query.checkpoint); }

    if (!query.entity) { return usedDiffs; }

    return usedDiffs.filter((diff) =>
      diff.entityHash === this.toEntityHash(query.entity.entityType, query.entity.identifier));
  }

  public toDiffWithHash (diff : ConfigurationDiff) : DiffWithHash {
    const entityHash = this.toEntityHash(diff.targetEntityType, diff.targetEntityIdentifier);
    return { ...diff, entityHash };
  }

  private toEntityHash (entityType : EntityType, entityIdentifier : string) : string {
    return `${entityType}${this.hashSeparator}${entityIdentifier}`;
  }

  private fromEntityHash (hash : string) : { entityType : EntityType, identifier : string } {
    const parts = hash.split(this.hashSeparator);

    return {
      entityType: parts[0] as EntityType,
      identifier: parts[1],
    };
  }
}
