import { type DMMF } from "@prisma/generator-helper";
import { type RelationManager } from "..";

export interface RelationUpdate {
  update(relationManager: RelationManager, newField?: DMMF.Field): void;
}
