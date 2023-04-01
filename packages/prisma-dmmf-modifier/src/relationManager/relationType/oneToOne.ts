import { type DMMF } from "@prisma/generator-helper";
import { RelationType } from "./relationType";

export class OneToOne extends RelationType {
  update(newField: DMMF.Field): void {
    const oldField = this.relationManager.fromField;
    const possibleChanges = {
      toManyToMany:
        newField.isList &&
        !oldField.isList &&
        this.relationManager.isManyToManyRelation,
      toOneToMany: newField.isList && !oldField.isList,
      toRequired: newField.isRequired && !oldField.isRequired,
      toUnRequired: !newField.isRequired && oldField.isRequired,
    };

    switch (true) {
      case possibleChanges.toManyToMany: {
        console.log("change relation to many to many");
        break;
      }
      case possibleChanges.toOneToMany: {
        console.log("change relation to one to many");
        break;
      }

      case possibleChanges.toRequired: {
        console.log("make it required");
        break;
      }
      case possibleChanges.toUnRequired: {
        console.log("make it not required");
        break;
      }

      default:
        break;
    }
  }
}
