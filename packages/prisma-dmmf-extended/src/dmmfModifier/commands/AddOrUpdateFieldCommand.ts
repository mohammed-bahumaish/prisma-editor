import { type DMMF } from "@prisma/generator-helper";
import { DMMFCommand } from "../dmmfModifier";
import { type Datamodel } from "../Datamodel";

export class AddOrUpdateFieldCommand extends DMMFCommand {
  constructor(
    private modelName: string,
    private field: DMMF.Field,
    private isManyToManyRelation?: boolean
  ) {
    super();
  }

  do(datamodel: Datamodel) {
    datamodel.addOrUpdateField(
      this.modelName,
      this.field,
      this.isManyToManyRelation
    );
  }
  // WTF undo of update is not remove!
  undo(datamodel: Datamodel) {
    datamodel.removeField(this.modelName, this.field);
  }
}
