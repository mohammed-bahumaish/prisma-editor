/* eslint-disable @typescript-eslint/no-unused-vars */
import { type DMMF } from "@prisma/generator-helper";
import { RelationType } from "./relationType";
import { type RelationUpdate } from "./types";
import { type RelationManager } from "..";
import { addFieldWithSafeName } from "../../helpers";

class ToOneToMany implements RelationUpdate {
  update(relationManager: RelationManager, newField: DMMF.Field) {
    relationManager.fromField.isList = false;
    relationManager.fromField.isRequired = newField.isRequired;

    const toModelIdField = relationManager.getIdField(
      relationManager.toModel.name
    );

    const newFieldName = addFieldWithSafeName(
      relationManager.datamodel,
      relationManager.fromModel.name,
      {
        name: `${newField.name}Id`,
        kind: "scalar",
        isList: false,
        isRequired: newField.isRequired,
        isUnique: false,
        isId: false,
        isReadOnly: true,
        hasDefaultValue: false,
        type: toModelIdField.type,
        isGenerated: false,
        isUpdatedAt: false,
      }
    );

    relationManager.fromField.relationFromFields = [newFieldName];
    relationManager.fromField.relationToFields = [toModelIdField.name];
  }
}
class ToReverseOneToMany implements RelationUpdate {
  update(relationManager: RelationManager, newField: DMMF.Field) {
    relationManager.toField.isList = false;
    relationManager.toField.isRequired = newField.isRequired;

    const fromModelIdField = relationManager.getIdField(
      relationManager.fromModel.name
    );

    const newFieldName = addFieldWithSafeName(
      relationManager.datamodel,
      relationManager.toModel.name,
      {
        name: `${newField.name}Id`,
        kind: "scalar",
        isList: false,
        isRequired: newField.isRequired,
        isUnique: false,
        isId: false,
        isReadOnly: true,
        hasDefaultValue: false,
        type: fromModelIdField.type,
        isGenerated: false,
        isUpdatedAt: false,
      }
    );

    relationManager.toField.relationFromFields = [newFieldName];
    relationManager.toField.relationToFields = [fromModelIdField.name];
  }
}

export class ManyToMany extends RelationType {
  update(newField: DMMF.Field): void {
    const updates: [boolean, new () => RelationUpdate][] = [
      [
        newField.isList && !this.relationManager.isManyToManyRelation,
        ToReverseOneToMany,
      ],
      [!newField.isList, ToOneToMany],
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
