import { RelationType } from ".";

export class OneToOne extends RelationType {
  update(newField: DMMF.Field): void {
    throw new Error("Method not implemented.");
  }
}
