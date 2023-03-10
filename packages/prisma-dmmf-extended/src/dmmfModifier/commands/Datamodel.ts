import { type DMMF } from "@prisma/generator-helper";
import { type datamodel } from "../types";
import { defaultRelationIdField, defaultRelationObjectField } from "./defaults";

export class Datamodel {
  constructor(private datamodel: datamodel) {}
  addOrUpdateField(
    modelName: string,
    field: DMMF.Field,
    isManyToManyRelation?: boolean
  ) {
    const modelIndex = this.datamodel.models.findIndex(
      (m) => m.name === modelName
    );
    if (modelIndex === -1) return this;

    const fieldIndex = this.datamodel.models[modelIndex].fields.findIndex(
      (f) => f.name === field.name
    );

    const fieldExists = fieldIndex !== -1;
    if (fieldExists) {
      this.removeField(modelName, field);
    }
    this.datamodel.models[modelIndex].fields.push(field);

    if (field.relationName) {
      const relationModelName = field.type;
      const foreignModelIndex = this.datamodel.models.findIndex(
        (m) => m.name === relationModelName
      );
      if (foreignModelIndex === -1) return this;

      const relationModelNewFields: DMMF.Field[] = [];

      const relationType: "1-1" | "1-n" | "n-m" = isManyToManyRelation
        ? "n-m"
        : field.isList
        ? "1-n"
        : "1-1";

      const idFieldName = modelName.toLowerCase() + "Id";
      let primaryKeyData = this.datamodel.models[modelIndex].fields.find(
        (f) => f.isId
      );

      // in case from table does not have an id, add it.
      if (!primaryKeyData) {
        primaryKeyData = {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: [],
          },
          isGenerated: false,
          isUpdatedAt: false,
        };
        this.datamodel.models[modelIndex].fields.push(primaryKeyData);
      }
      const addAtRelationToForeignTable =
        (field.relationFromFields?.length || 0) === 0 && relationType !== "n-m";

      const objectField: DMMF.Field = {
        ...defaultRelationObjectField,
        name: modelName.toLowerCase(),
        type: modelName,
        relationName: field.relationName,
        relationFromFields: addAtRelationToForeignTable ? [idFieldName] : [],
        relationToFields: addAtRelationToForeignTable
          ? [primaryKeyData.name]
          : [],
      };

      switch (relationType || "1-n") {
        case "1-1":
        case "1-n": {
          const foreignKeyField: DMMF.Field = {
            ...defaultRelationIdField,
            name: idFieldName,
            type: primaryKeyData.type,
          };

          relationModelNewFields.push(objectField, foreignKeyField);
          break;
        }
        case "n-m": {
          relationModelNewFields.push({
            ...objectField,
            isList: true,
            isRequired: true,
          });
          break;
        }

        default:
          break;
      }
      this.datamodel.models[foreignModelIndex].fields.push(
        ...relationModelNewFields
      );
    }
    return this;
  }

  removeField(modelName: string, field: DMMF.Field) {
    const modelIndex = this.datamodel.models.findIndex(
      (m) => m.name === modelName
    );
    if (modelIndex === -1) return this;

    const fieldsToBeRemoved = [...(field.relationFromFields || []), field.name];

    this.datamodel.models[modelIndex].fields = this.datamodel.models[
      modelIndex
    ].fields.filter((f) => !fieldsToBeRemoved.includes(f.name));

    const relationName = field.relationName;

    if (relationName) {
      const foreignModelIndex = this.datamodel.models.findIndex(
        (m) => m.name === field.type
      );
      if (foreignModelIndex === -1) return this;

      const foreignFieldsToBeRemoved: string[] = [];
      this.datamodel.models[foreignModelIndex].fields = this.datamodel.models[
        foreignModelIndex
      ].fields
        .filter((f) => {
          if (f.relationName !== relationName) {
            foreignFieldsToBeRemoved.push(...(f.relationFromFields || []));
            return true;
          }
          return false;
        })
        .filter((f) => !foreignFieldsToBeRemoved.includes(f.name));
    }

    return this;
  }
  get() {
    return this.datamodel;
  }
}
