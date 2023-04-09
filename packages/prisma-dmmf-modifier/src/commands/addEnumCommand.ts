import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class AddEnumCommand extends DMMFCommand {
  constructor(private enumName: string, private field: string) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.addEnum(this.enumName, this.field);
  }

  undo(datamodel: Datamodel) {
    datamodel.removeEnum(this.enumName, this.field);
  }
}
