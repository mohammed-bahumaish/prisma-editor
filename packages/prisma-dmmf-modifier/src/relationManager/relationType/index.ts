import { type DMMF } from "@prisma/generator-helper";
import { type RelationManager } from "..";
import { OneToOne } from "./oneToOne";
import { OneToMany } from "./oneToMany";
import { ManyToMany } from "./manyToMany";

export const getRelationType = (
  relationManager: RelationManager
): RelationType => {
  if (relationManager.fromField.isList && relationManager.toField.isList) {
    return new OneToOne(relationManager);
  } else if (
    relationManager.fromField.isList ||
    relationManager.toField.isList
  ) {
    return new OneToMany(relationManager);
  }
  return new ManyToMany(relationManager);
};

export abstract class RelationType {
  constructor(public relationManager: RelationManager) {}

  abstract update(newField: DMMF.Field): void;
}
