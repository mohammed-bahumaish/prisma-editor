import { type DMMF } from "@prisma/generator-helper";
import { type RelationManager } from "..";

export abstract class RelationType {
  constructor(public relationManager: RelationManager) {}

  abstract update(newField: Partial<DMMF.Field>): void;
}
