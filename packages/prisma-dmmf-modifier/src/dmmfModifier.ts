import { Datamodel } from "./Datamodel";
import { type datamodel } from "./types";

export abstract class DMMFCommand {
  abstract do(datamodel: Datamodel): void;
  abstract undo(datamodel: Datamodel): void;
}

export class DMMfModifier {
  private history: DMMFCommand[] = [];
  private datamodel: Datamodel;
  constructor(datamodel: datamodel) {
    this.datamodel = new Datamodel(datamodel);
  }
  get() {
    return this.datamodel.get();
  }
  set(datamodel: datamodel) {
    this.history = [];
    this.datamodel = new Datamodel(datamodel);
  }
  do(command: DMMFCommand) {
    command.do(this.datamodel);
    this.history.push(command);
  }
  undo() {
    const command = this.history.pop();
    if (command) command.undo(this.datamodel);
  }
}
