import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class AddEnumCommand extends DMMFCommand {
  constructor(private enumName: string, private oldField?: string) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.addEnum(this.enumName, this.oldField);
  }

  undo(datamodel: Datamodel) {
    datamodel.removeEnum(this.enumName);
  }
}
