import { type DMMF } from "@prisma/generator-helper";
import { type datamodel } from "..";

export const addOrUpdateFieldToDatamodel = (
  datamodel: datamodel,
  field: DMMF.Field,
  modelName: string
) => {
  const modelIndex = datamodel.models.findIndex((m) => m.name === modelName);
  if (modelIndex === -1) return datamodel;

  const fieldIndex = datamodel.models[modelIndex].fields.findIndex(
    (f) => f.name === field.name
  );

  if (fieldIndex !== -1) {
    datamodel.models[modelIndex].fields[fieldIndex] = field;
    return datamodel;
  }

  datamodel.models[modelIndex].fields.push(field);
  return datamodel;
};

export const removeFieldFromDatamodel = (
  datamodel: datamodel,
  field: DMMF.Field,
  modelName: string
) => {
  const modelIndex = datamodel.models.findIndex((m) => m.name === modelName);
  if (modelIndex === -1) return datamodel;

  const fieldIndex = datamodel.models[modelIndex].fields.findIndex(
    (f) => f.name === field.name
  );
  if (fieldIndex === -1) return datamodel;

  datamodel.models[modelIndex].fields = datamodel.models[
    modelIndex
  ].fields.filter((f) => f.name !== field.name);
  return datamodel;
};
