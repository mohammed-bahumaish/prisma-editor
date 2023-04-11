import { type Datamodel } from "../datamodel";
import { DMMFCommand } from "../dmmfModifier";

export class RemoveModelCommand extends DMMFCommand {
  constructor(private modelName: string) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.removeModel(this.modelName);
  }

  undo(): void {
    // todo
    throw new Error("Method not implemented.");
  }
}
