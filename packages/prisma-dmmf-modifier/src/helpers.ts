import { type DMMF } from "@prisma/generator-helper";
import { type datamodel } from "./types";

export type feedback = { name: string };

export const addFieldWithSafeName = (
  datamodel: datamodel,
  modelName: string,
  field: DMMF.Field,
  feedback: feedback
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
  feedback.name = field.name;

  dmmf.forEach((model) => {
    if (model.name === modelName) {
      model.fields.push(field);
    }
  });
};
