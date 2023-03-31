import { RelationType } from ".";

export class OneToMany extends RelationType {
  update(newField: DMMF.Field): void {
    throw new Error("Method not implemented.");
  }
}
