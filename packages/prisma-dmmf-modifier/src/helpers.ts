import { type DMMF } from "@prisma/generator-helper";
import { type datamodel } from "./types";

export const addFieldWithSafeName = (
  datamodel: datamodel,
  modelName: string,
  field: DMMF.Field
) => {
  const dmmf = datamodel.models;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentModel = dmmf.find((model) => model.name === modelName)!;
  const fieldNames = currentModel.fields.map((field) => field.name);
  let fieldName = field.name;
  let digit = 1;
  while (fieldNames.includes(fieldName)) {
    fieldName = `${field.name}${digit}`;
    digit++;
  }
  field.name = fieldName;

  dmmf.forEach((model) => {
    if (model.name === modelName) {
      model.fields.push(field);
    }
  });

  return field.name;
};
