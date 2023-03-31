/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type DMMF } from "@prisma/generator-helper";
import { type datamodel } from "../types";
import {
  type RelationType,
  getRelationType,
} from "./relationType/relationType";

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
    public originalFieldName: string
  ) {
    this.fromModel = this.datamodel.models.find(
      (m) => m.name === this.modelName
    )!;
    this.fromField = this.fromModel.fields.find(
      (f) => f.name === this.originalFieldName
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
    this.relationType = getRelationType(this);
  }

  update(newField: DMMF.Field) {
    this.relationType.update(newField);
  }
}
