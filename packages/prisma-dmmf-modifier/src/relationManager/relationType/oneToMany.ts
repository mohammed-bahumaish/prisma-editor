/* eslint-disable @typescript-eslint/no-unused-vars */
import { type DMMF } from "@prisma/generator-helper";
import { RelationType } from "./relationType";
import { type RelationUpdate } from "./types";
import { ToRequired as OneToOneToRequired } from "./oneToOne";
import { type RelationManager } from "..";

class ToManyToMany implements RelationUpdate {
  update(relationManager: RelationManager) {
    if (relationManager.fromFieldHasForeignField) {
      relationManager.updateFromField({
        name: relationManager.fromField.name,
        kind: "object",
        isList: true,
        isRequired: true,
        isUnique: false,
        isId: false,
        isReadOnly: false,
        hasDefaultValue: false,
        type: relationManager.toModel.name,
        relationName: relationManager.relationName,
        relationFromFields: [],
        relationToFields: [],
        isGenerated: false,
        isUpdatedAt: false,
      });
    } else {
      relationManager.updateToField({
        name: relationManager.toField.name,
        kind: "object",
        isList: true,
        isRequired: true,
        isUnique: false,
        isId: false,
        isReadOnly: false,
        hasDefaultValue: false,
        type: relationManager.fromModel.name,
        relationName: relationManager.relationName,
        relationFromFields: [],
        relationToFields: [],
        isGenerated: false,
        isUpdatedAt: false,
      });
    }
    relationManager.removeForeignKeyField();
  }
}
class ToOneToOne implements RelationUpdate {
  update(relationManager: RelationManager, newField: DMMF.Field) {
    relationManager.fromField.isList = false;
    relationManager.fromField.isRequired = false;

    if (newField.isRequired) {
      const toRequired = new OneToOneToRequired();
      toRequired.update(relationManager, newField);
    }
  }
}

class ToRequired implements RelationUpdate {
  update(relationManager: RelationManager) {
    if (relationManager.fromField.isList) return;
    relationManager.fromField.isRequired = true;
    relationManager.foreignKeyField.isRequired = true;
  }
}
class ToNotRequired implements RelationUpdate {
  update(relationManager: RelationManager) {
    if (relationManager.fromField.isList) return;
    relationManager.fromField.isRequired = false;
    relationManager.foreignKeyField.isRequired = false;
  }
}

export class OneToMany extends RelationType {
  update(newField: DMMF.Field): void {
    const oldField = this.relationManager.fromField;
    const updates: [boolean, new () => RelationUpdate][] = [
      [
        newField.isList &&
          (this.relationManager.isManyToManyRelation || !oldField.isList),
        ToManyToMany,
      ],
      [!newField.isList && oldField.isList, ToOneToOne],
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
