import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class RemoveEnumFieldCommand extends DMMFCommand {
  constructor(private enumName: string, private field: string) {
    super();
  }

  undo(datamodel: Datamodel) {
    datamodel.addEnumField(this.enumName, this.field);
  }

  do(datamodel: Datamodel) {
    datamodel.removeEnumField(this.enumName, this.field);
  }
}
