import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class AddModelCommand extends DMMFCommand {
  constructor(private modelName: string, private oldModelName?: string) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.addModel(this.modelName, this.oldModelName);
  }

  undo(datamodel: Datamodel): void {
    // todo
    datamodel.removeModel(this.modelName);
  }
}
