import { type DMMF } from "@prisma/generator-helper";
import { type datamodel, DMMFCommand } from "..";
import {
  addOrUpdateFieldToDatamodel,
  removeFieldFromDatamodel,
} from "./helpers";

export class AddOrUpdateFieldCommand extends DMMFCommand {
  constructor(private modelName: string, private field: DMMF.Field) {
    super();
  }

  do(datamodel: datamodel) {
    return addOrUpdateFieldToDatamodel(datamodel, this.field, this.modelName);
  }

  undo(datamodel: datamodel) {
    return removeFieldFromDatamodel(datamodel, this.field, this.modelName);
  }
}
