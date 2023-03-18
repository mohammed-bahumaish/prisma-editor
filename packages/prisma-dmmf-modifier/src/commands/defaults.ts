import { type DMMF } from "@prisma/generator-helper";

export const defaultIdField: DMMF.Field = {
  name: "id",
  kind: "scalar",
  isList: false,
  isRequired: true,
  isUnique: false,
  isId: true,
  isReadOnly: false,
  hasDefaultValue: true,
  type: "Int",
  default: {
    name: "autoincrement",
    args: [],
  },
  isGenerated: false,
  isUpdatedAt: false,
};

export const defaultRelationObjectField: DMMF.Field = {
  name: "user",
  kind: "object",
  isList: false,
  isRequired: false,
  isUnique: false,
  isId: false,
  isReadOnly: false,
  hasDefaultValue: false,
  type: "User",
  relationName: "PostToUser",
  relationFromFields: ["userId"],
  relationToFields: ["id"],
  isGenerated: false,
  isUpdatedAt: false,
};

export const defaultRelationIdField: DMMF.Field = {
  name: "userId",
  kind: "scalar",
  isList: false,
  isRequired: false,
  isUnique: false,
  isId: false,
  isReadOnly: true,
  hasDefaultValue: false,
  type: "Int",
  isGenerated: false,
  isUpdatedAt: false,
};
