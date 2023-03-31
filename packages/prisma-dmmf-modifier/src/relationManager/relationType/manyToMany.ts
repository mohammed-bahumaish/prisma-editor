import { RelationType } from ".";

export class ManyToMany extends RelationType {
  update(newField: DMMF.Field): void {
    throw new Error("Method not implemented.");
  }
}
