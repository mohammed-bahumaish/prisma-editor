/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type DMMF } from "@prisma/generator-helper";
import { addEnumFieldWithSafeName, addFieldWithSafeName } from "./helpers";
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

      this.datamodel.models = this.datamodel.models.map((d) => ({
        ...d,
        fields: d.fields.map((f) => {
          if (f.type !== oldName) return f;
          return { ...f, type: modelName };
        }),
      }));
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
    const relationNames: string[] = [];
    this.datamodel.models
      .find((d) => d.name === modelName)!
      .fields.forEach((f) => {
        if (f.relationName) relationNames.push(f.relationName);
      });
    const foreignKeys: { model: string; key: string }[] = [];

    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.filter((f) => {
        if (!f.relationName) return true;
        else if (relationNames.includes(f.relationName)) {
          if (f.relationFromFields && f.relationFromFields.length > 0) {
            foreignKeys.push(
              ...f.relationFromFields.map((k) => ({ model: d.name, key: k }))
            );
          }
          return false;
        }
        return true;
      }),
    }));

    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.filter((f) => {
        if (
          foreignKeys.findIndex(
            (k) => k.key === f.name && k.model === d.name
          ) !== -1
        ) {
          return false;
        }
        return true;
      }),
    }));

    this.datamodel.models = this.datamodel.models.filter(
      (m) => m.name !== modelName
    );
  }

  addEnum(enumName: string, oldName?: string) {
    if (oldName) {
      const oldEnumIndex = this.datamodel.enums.findIndex(
        (m) => m.name === oldName
      );

      this.datamodel.enums[oldEnumIndex].name = enumName;

      this.datamodel.models = this.datamodel.models.map((d) => ({
        ...d,
        fields: d.fields.map((f) => {
          if (f.type !== oldName) return f;
          return { ...f, type: enumName };
        }),
      }));
    } else {
      const enumIndex = this.datamodel.enums.findIndex(
        (m) => m.name === enumName
      );
      if (enumIndex === -1)
        this.datamodel.enums.push({
          name: enumName,
          values: [{ dbName: null, name: "CHANGE_ME" }],
          dbName: null,
        });
    }
  }
  removeEnum(enumName: string) {
    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.filter((f) => {
        if (f.type === enumName) return false;
        return true;
      }),
    }));

    this.datamodel.enums = this.datamodel.enums.filter(
      (e) => e.name !== enumName
    );
  }

  addEnumField(enumName: string, field: string) {
    addEnumFieldWithSafeName(this.datamodel, enumName, field);
  }
  updateEnumField(enumName: string, field: string, oldField: string) {
    const enumIndex = this.datamodel.enums.findIndex(
      (e) => e.name === enumName
    );
    if (enumIndex === -1) return;
    const valueIndex = this.datamodel.enums[enumIndex].values.findIndex(
      (e) => e.name === oldField
    );
    if (valueIndex === -1) return;
    this.datamodel.enums[enumIndex].values[valueIndex].name = field;

    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.map((f) => {
        if (f.type === enumName && f.default === oldField)
          return { ...f, default: field };
        return f;
      }),
    }));

    return this;
  }
  removeEnumField(enumName: string, field: string) {
    const enumIndex = this.datamodel.enums.findIndex(
      (e) => e.name === enumName
    );
    if (enumIndex === -1) return;
    this.datamodel.enums[enumIndex].values = this.datamodel.enums[
      enumIndex
    ].values.filter((v) => v.name !== field);

    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.map((f) => {
        if (f.type === enumName && f.default === field) {
          delete f.default;
        }
        return f;
      }),
    }));

    return this;
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
              isUnique: false,
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
    field: Partial<DMMF.Field>,
    isManyToManyRelation = false
  ) {
    const dmmf = this.datamodel.models;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const model = dmmf.find((model) => model.name === modelName)!;
    const fieldIndex = model.fields.findIndex(
      (f) => f.name === originalFieldName
    );
    if (
      (model.fields[fieldIndex].kind === "scalar" && field.kind === "scalar") ||
      (model.fields[fieldIndex].kind === "enum" && field.kind === "enum")
    ) {
      const updated = { ...model.fields[fieldIndex], ...field };

      if (typeof updated.default === "string") {
        // this is a workaround! for some reason \" is been added to a String default value!
        // fix this if you can identify the source of the bug
        updated.default = updated.default.replaceAll('"', "");

        if (updated.type === "Int") updated.default = +updated.default;
      }

      if (updated.default === undefined) delete updated.default;
      if (updated.native === undefined) delete updated.native;

      model.fields[fieldIndex] = updated;
    } else {
      const relationManager = new RelationManager(
        this.datamodel,
        modelName,
        originalFieldName,
        isManyToManyRelation
      );
      relationManager.update(field);
      if (field.name) relationManager.fromField.name = field.name;
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
