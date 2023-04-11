import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class UpdateEnumFieldCommand extends DMMFCommand {
  constructor(
    private enumName: string,
    private field: string,
    private oldField: string
  ) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.updateEnumField(this.enumName, this.field, this.oldField);
  }

  undo() {
    // todo
    throw new Error("Method not implemented.");
  }
}
