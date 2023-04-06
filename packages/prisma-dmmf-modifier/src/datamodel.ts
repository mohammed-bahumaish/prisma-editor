/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type DMMF } from "@prisma/generator-helper";
import { addFieldWithSafeName } from "./helpers";
import { RelationManager } from "./relationManager";
import { type datamodel } from "./types";
export class Datamodel {
  constructor(private datamodel: datamodel) {}

  addModel(modelName: string, oldName?: string) {
    if (oldName) {
      const oldModelIndex = this.datamodel.models.findIndex(
        (m) => m.name === oldName
      );

      this.datamodel.models[oldModelIndex].name = modelName;
    } else {
      const modelIndex = this.datamodel.models.findIndex(
        (m) => m.name === modelName
      );
      if (modelIndex === -1)
        this.datamodel.models.push({
          name: modelName,
          dbName: null,
          fields: [
            {
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
            },
          ],
          primaryKey: null,
          uniqueFields: [],
          uniqueIndexes: [],
          isGenerated: false,
        });
    }
  }
  removeModel(modelName: string) {
    this.datamodel.models = this.datamodel.models.filter(
      (m) => m.name !== modelName
    );
  }

  addField(
    modelName: string,
    field: DMMF.Field,
    relationType?: "1-1" | "1-n" | "n-m"
  ) {
    const addedFieldName = addFieldWithSafeName(
      this.datamodel,
      modelName,
      field
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentModel = this.datamodel.models.find(
      (model) => model.name === modelName
    )!;

    if (relationType) {
      const relationNames = currentModel.fields.flatMap((f) => {
        if (f.name !== field.name) return [f.relationName];
        return [];
      });

      let relationName = field.relationName;
      let digit = 1;
      while (relationNames.includes(relationName)) {
        relationName = `${field.relationName || ""}${digit}`;
        digit++;
      }
      field.relationName = relationName;
      switch (relationType) {
        case "1-1": {
          const toIdField = this.getIdField(field.type);
          const newFieldName = addFieldWithSafeName(this.datamodel, modelName, {
            name: `${addedFieldName}Id`,
            kind: "scalar",
            isList: false,
            isRequired: field.isRequired,
            isUnique: true,
            isId: false,
            isReadOnly: true,
            hasDefaultValue: false,
            type: toIdField.type,
            isGenerated: false,
            isUpdatedAt: false,
          });

          field.relationFromFields = [newFieldName];
          field.relationToFields = [toIdField.name];

          this.addField(field.type, {
            name: modelName.toLowerCase(),
            kind: "object",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: modelName,
            relationName: field.relationName,
            relationFromFields: [],
            relationToFields: [],
            isGenerated: false,
            isUpdatedAt: false,
          });

          break;
        }
        case "1-n": {
          const fromIdField = this.getIdField(modelName);

          const newFieldName = addFieldWithSafeName(
            this.datamodel,
            field.type,
            {
              name: `${modelName.toLowerCase()}Id`,
              kind: "scalar",
              isList: false,
              isRequired: false,
              isUnique: true,
              isId: false,
              isReadOnly: true,
              hasDefaultValue: false,
              type: fromIdField.type,
              isGenerated: false,
              isUpdatedAt: false,
            }
          );

          field.relationFromFields = [];
          field.relationToFields = [];

          addFieldWithSafeName(this.datamodel, field.type, {
            name: modelName.toLowerCase(),
            kind: "object",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: modelName,
            relationName: field.relationName,
            relationFromFields: [newFieldName],
            relationToFields: [fromIdField.name],
            isGenerated: false,
            isUpdatedAt: false,
          });

          break;
        }

        case "n-m": {
          field.relationFromFields = [];
          field.relationToFields = [];

          this.addField(field.type, {
            name: modelName.toLowerCase(),
            kind: "object",
            isList: true,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: modelName,
            relationName: field.relationName,
            relationFromFields: [],
            relationToFields: [],
            isGenerated: false,
            isUpdatedAt: false,
          });

          break;
        }

        default:
          break;
      }
    }
    return this;
  }
  updateField(
    modelName: string,
    originalFieldName: string,
    field: DMMF.Field,
    isManyToManyRelation = false
  ) {
    const dmmf = this.datamodel.models;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const model = dmmf.find((model) => model.name === modelName)!;
    const fieldIndex = model.fields.findIndex(
      (f) => f.name === originalFieldName
    );
    if (model.fields[fieldIndex].kind === "scalar" && field.kind === "scalar") {
      model.fields[fieldIndex] = field;
    } else {
      const relationManager = new RelationManager(
        this.datamodel,
        modelName,
        originalFieldName,
        isManyToManyRelation
      );
      relationManager.update(field);
      relationManager.fromField.name = field.name;
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
          if (f.relationName === relationName) {
            foreignFieldsToBeRemoved.push(...(f.relationFromFields || []));
            return false;
          }
          return true;
        })
        .filter((f) => !foreignFieldsToBeRemoved.includes(f.name));
    }
    return this;
  }
  get() {
    return this.datamodel;
  }
  getIdField(model: string) {
    return this.datamodel.models
      .find((m) => m.name === model)!
      .fields.find((f) => f.isId)!;
  }
}
