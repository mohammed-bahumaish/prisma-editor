import { type DMMF } from "@prisma/generator-helper";
import { RelationType } from "./relationType";

export class ManyToMany extends RelationType {
  update(newField: DMMF.Field): void {
    // const oldField = this.relationManager.fromField;
    const possibleChanges = {
      toOneToMany:
        newField.isList && !this.relationManager.isManyToManyRelation,
      toReverseOneToMany: !newField.isList,
    };

    switch (true) {
      case possibleChanges.toOneToMany: {
        console.log("change relation to one to many");
        break;
      }

      case possibleChanges.toReverseOneToMany: {
        console.log("make it required");
        break;
      }

      default:
        break;
    }
  }
}
