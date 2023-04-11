import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class AddEnumFieldCommand extends DMMFCommand {
  constructor(private enumName: string, private field: string) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.addEnumField(this.enumName, this.field);
  }

  undo(datamodel: Datamodel) {
    datamodel.removeEnumField(this.enumName, this.field);
  }
}
