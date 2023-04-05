/* eslint-disable @typescript-eslint/no-unused-vars */
import { type DMMF } from "@prisma/generator-helper";
import { RelationType } from "./relationType";
import { type RelationUpdate } from "./types";
import { type RelationManager } from "..";

class ToManyToMany implements RelationUpdate {
  update(relationManager: RelationManager, _newField: DMMF.Field) {
    console.log(
      "changing to many to many, from field:",
      relationManager.fromField
    );
  }
}
class ToOneToOne implements RelationUpdate {
  update(_relationManager: RelationManager, _newField: DMMF.Field) {
    console.log("changing");
  }
}
class ToReverse implements RelationUpdate {
  update(_relationManager: RelationManager, _newField: DMMF.Field) {
    console.log("changing reverse");
  }
}
class ToRequired implements RelationUpdate {
  update(_relationManager: RelationManager, _newField: DMMF.Field) {
    console.log("changing");
  }
}
class ToNotRequired implements RelationUpdate {
  update(_relationManager: RelationManager, _newField: DMMF.Field) {
    console.log("changing");
  }
}

export class OneToMany extends RelationType {
  update(newField: DMMF.Field): void {
    const oldField = this.relationManager.fromField;
    const updates: [boolean, new () => RelationUpdate][] = [
      [
        newField.isList && this.relationManager.isManyToManyRelation,
        ToManyToMany,
      ],
      [!newField.isList && oldField.isList, ToOneToOne],
      [newField.isList && !oldField.isList, ToReverse],
      [newField.isRequired && !oldField.isRequired, ToRequired],
      [!newField.isRequired && oldField.isRequired, ToNotRequired],
    ];

    for (const [condition, Class] of updates) {
      if (condition) {
        const instance = new Class();
        instance.update(this.relationManager, newField);
        break;
      }
    }
  }
}
