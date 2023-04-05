/* eslint-disable @typescript-eslint/no-unused-vars */
import { type DMMF } from "@prisma/generator-helper";
import { RelationType } from "./relationType";
import { type RelationUpdate } from "./types";
import { type RelationManager } from "..";
import { addFieldWithSafeName } from "../../helpers";

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

    if (relationManager.fromFieldHasForeignField) {
      relationManager.removeForeignKeyField();
      const fieldName = addFieldWithSafeName(
        relationManager.datamodel,
        relationManager.toModel.name,
        {
          name: `${relationManager.toField.name}Id`,
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: true,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false,
        }
      );

      relationManager.toField.relationFromFields = [fieldName];
      relationManager.toField.relationToFields = [
        relationManager.fromModel.fields.find((f) => f.isId)?.name,
      ];
    }

    console.log("updated in one to one");
  }
}
class ToRequired implements RelationUpdate {
  update(relationManager: RelationManager, _newField: DMMF.Field) {
    if (relationManager.fromFieldHasForeignField) {
      relationManager.fromField.isRequired = true;
      relationManager.foreignKeyField.isRequired = true;
    } else {
      relationManager.removeForeignKeyField();
      relationManager.toField.isRequired = false;
      relationManager.toField.relationFromFields = [];
      relationManager.toField.relationToFields = [];

      relationManager.fromField.isRequired = true;
      const idFieldName = addFieldWithSafeName(
        relationManager.datamodel,
        relationManager.fromModel.name,
        {
          ...relationManager.foreignKeyField,
          name: `${relationManager.fromField.name}Id`,
          isRequired: true,

          kind: "scalar",
          isList: false,
          isUnique: true,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false,
        }
      );
      relationManager.fromField.relationFromFields = [idFieldName];
      const toIdField = relationManager.getIdField(
        relationManager.toModel.name
      );
      relationManager.fromField.relationToFields = [toIdField.name];
    }
  }
}
class ToNotRequired implements RelationUpdate {
  update(relationManager: RelationManager, _newField: DMMF.Field) {
    relationManager.fromField.isRequired = false;
    relationManager.foreignKeyField.isRequired = false;
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
