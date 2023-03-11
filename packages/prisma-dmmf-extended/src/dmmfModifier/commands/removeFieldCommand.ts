import { type DMMF } from "@prisma/generator-helper";
import { type datamodel, DMMFCommand } from "..";
import {
  addOrUpdateFieldToDatamodel,
  removeFieldFromDatamodel,
} from "./helpers";

export class removeFieldCommand extends DMMFCommand {
  private field!: DMMF.Field;
  constructor(private modelName: string, private fieldName: string) {
    super();
  }

  do(datamodel: datamodel) {
    const f = datamodel.models
      .find((m) => m.name === this.modelName)
      ?.fields.find((f) => f.name === this.fieldName);

    if (!f) return datamodel;
    else this.field = f;

    return removeFieldFromDatamodel(datamodel, this.field, this.modelName);
  }

  undo(datamodel: datamodel) {
    return addOrUpdateFieldToDatamodel(datamodel, this.field, this.modelName);
  }
}
