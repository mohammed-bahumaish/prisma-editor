import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class RemoveEnumCommand extends DMMFCommand {
  constructor(private enumName: string, private field: string) {
    super();
  }

  undo(datamodel: Datamodel) {
    datamodel.addEnum(this.enumName, this.field);
  }

  do(datamodel: Datamodel) {
    datamodel.removeEnum(this.enumName, this.field);
  }
}
