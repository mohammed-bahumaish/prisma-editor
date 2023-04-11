import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class RemoveEnumCommand extends DMMFCommand {
  constructor(private enumName: string) {
    super();
  }

  undo(datamodel: Datamodel) {
    datamodel.removeEnum(this.enumName);
  }

  do() {
    throw new Error("Method not implemented.");
  }
}
