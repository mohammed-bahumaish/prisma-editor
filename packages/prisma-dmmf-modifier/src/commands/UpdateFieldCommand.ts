import { type DMMF } from "@prisma/generator-helper";
import { DMMFCommand } from "../dmmfModifier";
import { type Datamodel } from "../Datamodel";

export class UpdateFieldCommand extends DMMFCommand {
  constructor(
    private modelName: string,
    private field: DMMF.Field,
    private isManyToManyRelation?: boolean,
    private removeIfExistOldName?: string
  ) {
    super();
  }

  do(datamodel: Datamodel) {
    console.log(this.removeIfExistOldName);
    datamodel.addField(
      this.modelName,
      this.field,
      this.isManyToManyRelation,
      this.removeIfExistOldName
    );
  }
  undo(): void {
    // todo
    throw new Error("Method not implemented.");
  }
}
