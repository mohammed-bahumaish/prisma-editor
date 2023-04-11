import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class RemoveEnumCommand extends DMMFCommand {
  constructor(private enumName: string) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.removeEnum(this.enumName);
  }

  undo() {
    throw new Error("Method not implemented.");
  }
}
