import { type DMMF } from "@prisma/generator-helper";
import { RelationType } from "./relationType";

export class OneToMany extends RelationType {
  update(newField: DMMF.Field): void {
    const oldField = this.relationManager.fromField;
    const possibleChanges = {
      toManyToMany:
        newField.isList && this.relationManager.isManyToManyRelation,
      toOneToOne: !newField.isList && oldField.isList,
      reverse: newField.isList && !oldField.isList,
      toRequired: newField.isRequired && !oldField.isRequired,
      toNotRequired: !newField.isRequired && oldField.isRequired,
    };

    switch (true) {
      case possibleChanges.toManyToMany: {
        console.log("change relation to many to many");
        break;
      }
      case possibleChanges.toOneToOne: {
        console.log("change relation to one to many");
        break;
      }
      case possibleChanges.reverse: {
        console.log("change relation to one to many");
        break;
      }

      case possibleChanges.toRequired: {
        console.log("make it required");
        break;
      }
      case possibleChanges.toNotRequired: {
        console.log("make it not required");
        break;
      }

      default:
        break;
    }
  }
}
