import { type DMMF } from "@prisma/generator-helper";
import { type datamodel, DMMFCommand } from "..";

export class AddFieldCommand extends DMMFCommand {
  constructor(private field: DMMF.Field, private modelName: string) {
    super();
  }

  execute(datamodel: datamodel) {
    const modelIndex =
      datamodel.models.findIndex((m) => m.name === this.modelName) ?? -1;
    if (modelIndex === -1) return datamodel;

    const fieldIndex = datamodel.models[modelIndex].fields.findIndex(
      (f) => f.name === this.field.name
    );
    if (fieldIndex !== -1) return datamodel;

    datamodel.models[modelIndex].fields.push(this.field);
    return datamodel;
  }

  undo(datamodel: datamodel) {
    const modelIndex =
      datamodel.models.findIndex((m) => m.name === this.modelName) ?? -1;
    if (modelIndex === -1) return datamodel;

    const fieldIndex = datamodel.models[modelIndex].fields.findIndex(
      (f) => f.name === this.field.name
    );
    if (fieldIndex === -1) return datamodel;

    datamodel.models[modelIndex].fields = datamodel.models[
      modelIndex
    ].fields.filter((f) => f.name !== this.field.name);
    return datamodel;
  }
}
