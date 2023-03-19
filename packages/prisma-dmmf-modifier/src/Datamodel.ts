import { type DMMF } from "@prisma/generator-helper";
import { type datamodel } from "./types";
import {
  defaultRelationIdField,
  defaultRelationObjectField,
} from "./commands/defaults";

export class Datamodel {
  constructor(private datamodel: datamodel) {}
  addField(
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

    let fieldExists = fieldIndex !== -1;
    let duplicate = "";
    if (fieldExists) {
      for (let i = 1; fieldExists; i++) {
        const fieldIndex = this.datamodel.models[modelIndex].fields.findIndex(
          (f) => f.name === `${field.name}${i}`
        );
        if (fieldIndex === -1) {
          duplicate = i.toString();
          fieldExists = false;
        }
      }

      field.name = `${field.name}${duplicate}`;
    }
    this.datamodel.models[modelIndex].fields.push(field);

    if (field.relationName) {
      const relationIndex = this.datamodel.models[modelIndex].fields.findIndex(
        (f) => f.relationName === field.relationName
      );
      console.log(
        "this.datamodel.models[modelIndex].fields[relationIndex]",
        this.datamodel.models[modelIndex].fields[relationIndex]
      );

      let relationExists = relationIndex !== -1;
      let rDuplicate = "";
      if (relationExists) {
        for (let i = 1; relationExists; i++) {
          const fieldIndex = this.datamodel.models[modelIndex].fields.findIndex(
            (f) => f.relationName === `${field.relationName!}${i}`
          );
          if (fieldIndex === -1) {
            rDuplicate = i.toString();
            relationExists = false;
          }
        }

        console.log("field.relationName ", field.relationName);
        field.relationName = `${field.relationName}${rDuplicate}`;
        console.log("field.relationName ", field.relationName);
      }

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

      const idFieldName = modelName.toLowerCase() + "Id" + duplicate;
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
        case "1-1": {
          const foreignKeyField: DMMF.Field = {
            ...defaultRelationIdField,
            name: idFieldName,
            type: primaryKeyData.type,
            isUnique: true,
          };

          relationModelNewFields.push(
            {
              ...objectField,
              name: objectField.name + duplicate,
              isUnique: true,
            },
            foreignKeyField
          );
          break;
        }
        case "1-n": {
          const foreignKeyField: DMMF.Field = {
            ...defaultRelationIdField,
            name: idFieldName,
            type: primaryKeyData.type,
          };

          relationModelNewFields.push(
            {
              ...objectField,
              name: objectField.name + "s" + duplicate,
            },
            foreignKeyField
          );
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
