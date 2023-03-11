import { type DMMF } from "@prisma/generator-helper";

export type datamodel = DMMF.Document["datamodel"];

export abstract class DMMFCommand {
  abstract execute(datamodel: datamodel): datamodel;
  abstract undo(datamodel: datamodel): datamodel;
}

export class DMMfModifier {
  private history: DMMFCommand[] = [];
  constructor(private datamodel: datamodel) {}
  get() {
    return this.datamodel;
  }
  do(command: DMMFCommand) {
    this.datamodel = command.execute(this.datamodel);
    this.history.push(command);
  }
  undo() {
    const command = this.history.pop();
    if (command) this.datamodel = command.undo(this.datamodel);
  }
  //   removeModelField(modelName: string, field: DMMF.Field) {
  //     const modelIndex =
  //       this.datamodel.models.findIndex((m) => m.name === modelName) ?? -1;
  //     if (modelIndex === -1) return;

  //     const fieldIndex = this.datamodel.models[modelIndex].fields.findIndex(
  //       (f) => f.name === field.name
  //     );
  //     if (fieldIndex !== -1) return;

  //     this.datamodel.models[modelIndex].fields.push(field);
  //   }
  //   addModel(model: DMMF.Model) {
  //     this.datamodel.models.push(model);
  //   }
}
