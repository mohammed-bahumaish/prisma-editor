/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type DMMF } from "@prisma/generator-helper";
import { type datamodel } from "../types";
import {
  ManyToMany,
  OneToMany,
  OneToOne,
  type RelationType,
} from "./relationType";

export class RelationManager {
  public relationType: RelationType;
  public fromModel: DMMF.Model;
  public fromField: DMMF.Field;
  public foreignKeyField!: DMMF.Field;
  public fromFieldHasForeignField: boolean;
  public toModel: DMMF.Model;
  public toField: DMMF.Field;
  public toFieldHasForeignField: boolean;
  public relationName: string;

  constructor(
    public datamodel: datamodel,
    public modelName: string,
    public fieldName: string,
    public isManyToManyRelation = false
  ) {
    this.fromModel = this.datamodel.models.find(
      (m) => m.name === this.modelName
    )!;
    this.fromField = this.fromModel.fields.find(
      (f) => f.name === this.fieldName
    )!;

    this.fromFieldHasForeignField =
      Array.isArray(this.fromField.relationFromFields) &&
      this.fromField.relationFromFields.length > 0;

    if (this.fromFieldHasForeignField) {
      this.foreignKeyField = this.fromModel.fields.find(
        (f) => f.name === this.fromField.relationFromFields![0]
      )!;
    }
    this.toModel = this.datamodel.models.find(
      (m) => m.name === this.fromField.type
    )!;
    this.relationName = this.fromField.relationName!;
    this.toField = this.toModel.fields.find(
      (f) => f.relationName === this.relationName
    )!;
    this.toFieldHasForeignField =
      Array.isArray(this.toField.relationFromFields) &&
      this.toField.relationFromFields.length > 0;
    if (this.toFieldHasForeignField) {
      this.foreignKeyField = this.toModel.fields.find(
        (f) => f.name === this.toField.relationFromFields![0]
      )!;
    }
    this.relationType = this.getRelationType(this);
  }

  update(newField: DMMF.Field) {
    this.relationType.update(newField);
  }

  getRelationTypeName() {
    if (this.fromField.isList && this.toField.isList) {
      return "n-m";
    } else if (this.fromField.isList || this.toField.isList) {
      return "1-n";
    }
    return "1-1";
  }

  getRelationType(relationManager: RelationManager) {
    const type = this.getRelationTypeName();
    const relationTypes = {
      "1-1": OneToOne,
      "1-n": OneToMany,
      "n-m": ManyToMany,
    };
    return new relationTypes[type](relationManager);
  }

  removeForeignKeyField() {
    const modelHadForeignKey = this.fromFieldHasForeignField
      ? "fromModel"
      : "toModel";
    this[modelHadForeignKey].fields = this[modelHadForeignKey].fields.filter(
      (f) => f.name !== this.foreignKeyField.name
    );
  }

  updateFromField(props: DMMF.Field) {
    const formFieldIndex = this.fromModel.fields.findIndex(
      (f) => f.name === this.fromField.name
    );
    this.fromModel.fields[formFieldIndex] = props;
  }
  updateToField(props: DMMF.Field) {
    const toFieldIndex = this.toModel.fields.findIndex(
      (f) => f.name === this.toField.name
    );
    this.toModel.fields[toFieldIndex] = props;
  }
}
