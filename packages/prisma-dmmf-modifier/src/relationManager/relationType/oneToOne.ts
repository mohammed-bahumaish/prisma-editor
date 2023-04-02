/* eslint-disable @typescript-eslint/no-unused-vars */
import { type DMMF } from "@prisma/generator-helper";
import { RelationType } from "./relationType";
import { type RelationUpdate } from "./types";
import { type RelationManager } from "..";

class ToManyToMany implements RelationUpdate {
  update(relationManager: RelationManager, _newField: DMMF.Field) {
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

    relationManager.removeForeignKeyField();
  }
}
class ToOneToMany implements RelationUpdate {
  update(_relationManager: RelationManager, _newField: DMMF.Field) {
    console.log("change relation to one to many");
  }
}
class ToRequired implements RelationUpdate {
  update(_relationManager: RelationManager, _newField: DMMF.Field) {
    console.log("make it required");
  }
}
class ToNotRequired implements RelationUpdate {
  update(_relationManager: RelationManager, _newField: DMMF.Field) {
    console.log("make it not required");
  }
}

export class OneToOne extends RelationType {
  update(newField: DMMF.Field): void {
    const oldField = this.relationManager.fromField;
    const updates: [boolean, new () => RelationUpdate][] = [
      [
        newField.isList && this.relationManager.isManyToManyRelation,
        ToManyToMany,
      ],
      [newField.isList, ToOneToMany],
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
