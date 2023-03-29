import { type DMMF } from "@prisma/generator-helper";
import { DMMFCommand } from "../dmmfModifier";
import { type Datamodel } from "../Datamodel";

export class UpdateFieldCommand extends DMMFCommand {
  constructor(
    private modelName: string,
    private originalFieldName: string,
    private field: DMMF.Field
  ) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.updateField(this.modelName, this.originalFieldName, this.field);
  }
  undo(): void {
    // todo
    throw new Error("Method not implemented.");
  }
}
