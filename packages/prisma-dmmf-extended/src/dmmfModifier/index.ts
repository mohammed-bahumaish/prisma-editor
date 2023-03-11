import { type DMMF } from "@prisma/generator-helper";

export type datamodel = DMMF.Document["datamodel"];

export abstract class DMMFCommand {
  abstract do(datamodel: datamodel): datamodel;
  abstract undo(datamodel: datamodel): datamodel;
}

export class DMMfModifier {
  private history: DMMFCommand[] = [];
  constructor(private datamodel: datamodel) {}
  get() {
    return this.datamodel;
  }
  do(command: DMMFCommand) {
    this.datamodel = command.do(this.datamodel);
    this.history.push(command);
  }
  undo() {
    const command = this.history.pop();
    if (command) this.datamodel = command.undo(this.datamodel);
  }
}
