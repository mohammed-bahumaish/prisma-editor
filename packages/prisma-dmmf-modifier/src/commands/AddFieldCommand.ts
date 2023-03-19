import { type DMMF } from "@prisma/generator-helper";
import { DMMFCommand } from "../dmmfModifier";
import { type Datamodel } from "../Datamodel";

export class AddFieldCommand extends DMMFCommand {
  constructor(
    private modelName: string,
    private field: DMMF.Field,
    private isManyToManyRelation?: boolean
  ) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.addField(this.modelName, this.field, this.isManyToManyRelation);
  }

  undo(datamodel: Datamodel) {
    datamodel.removeField(this.modelName, this.field);
  }
}
