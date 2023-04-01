import { type DMMF } from "@prisma/generator-helper";
import { DMMFCommand } from "../dmmfModifier";
import { type Datamodel } from "../datamodel";

export class RemoveFieldCommand extends DMMFCommand {
  private field!: DMMF.Field;
  constructor(private modelName: string, private fieldName: string) {
    super();
  }

  do(datamodel: Datamodel) {
    const f = datamodel
      .get()
      .models.find((m) => m.name === this.modelName)
      ?.fields.find((f) => f.name === this.fieldName);

    if (!f) return;
    else this.field = f;

    datamodel.removeField(this.modelName, this.field);
  }

  undo(datamodel: Datamodel) {
    datamodel.addField(this.modelName, this.field);
  }
}
