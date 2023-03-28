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
    const relationType: "1-1" | "1-n" | "n-m" = this.isManyToManyRelation
      ? "n-m"
      : this.field.isList
      ? "1-n"
      : "1-1";
    datamodel.addField(this.modelName, this.field, relationType);
  }
  undo(): void {
    // todo
    throw new Error("Method not implemented.");
  }
}
