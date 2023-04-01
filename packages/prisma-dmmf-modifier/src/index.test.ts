import { type DMMF } from "@prisma/generator-helper";
import { DMMfModifier } from "./dmmfModifier";
import { AddOrUpdateFieldCommand } from "./commands/addFieldCommand";
import { removeFieldCommand } from "./commands/removeFieldCommand";
import { dmmfExample, dmmfExampleToTestRelation } from "./__dmmfExample";

const dmmfModifier = new DMMfModifier(dmmfExample);

test("add field command", () => {
  const addField = new AddOrUpdateFieldCommand("User", {
    name: "nickname",
    kind: "scalar",
    isList: false,
    isRequired: true,
    isUnique: true,
    isId: false,
    isReadOnly: false,
    hasDefaultValue: false,
    type: "String",
    isGenerated: false,
    isUpdatedAt: false,
  });

  dmmfModifier.do(addField);

  const fieldIsAdded = dmmfModifier
    .get()
    .models.find((m) => m.name === "User")
    ?.fields.findIndex((f) => f.name === "nickname");

  expect(fieldIsAdded).not.toBe(-1);

  dmmfModifier.undo();

  const fieldIsUnAdded = dmmfModifier
    .get()
    .models.find((m) => m.name === "User")
    ?.fields.findIndex((f) => f.name === "nickname");

  expect(fieldIsUnAdded).toBe(-1);
});

test("remove field command", () => {
  const addField = new AddOrUpdateFieldCommand("User", {
    name: "nickname2",
    kind: "scalar",
    isList: false,
    isRequired: true,
    isUnique: true,
    isId: false,
    isReadOnly: false,
    hasDefaultValue: false,
    type: "String",
    isGenerated: false,
    isUpdatedAt: false,
  });

  dmmfModifier.do(addField);

  const fieldIsAdded =
    dmmfModifier
      .get()
      .models.find((m) => m.name === "User")
      ?.fields.findIndex((f) => f.name === "nickname2") !== -1;

  expect(fieldIsAdded).toBe(true);

  const removeField = new removeFieldCommand("User", "nickname2");

  dmmfModifier.do(removeField);

  const fieldIsRemoved =
    dmmfModifier
      .get()
      .models.find((m) => m.name === "User")
      ?.fields.findIndex((f) => f.name === "nickname2") === -1;

  expect(fieldIsRemoved).toBe(true);

  dmmfModifier.undo();

  const fieldIsUnRemoved =
    dmmfModifier
      .get()
      .models.find((m) => m.name === "User")
      ?.fields.findIndex((f) => f.name === "nickname2") !== -1;

  expect(fieldIsUnRemoved).toBe(true);
});

test("add one to one relation", () => {
  const dmmfModifierOneToOne = new DMMfModifier(dmmfExampleToTestRelation);
  const oneToOneFieldObject: DMMF.Field = {
    name: "post",
    kind: "object",
    isList: false,
    isRequired: false,
    isUnique: false,
    isId: false,
    isReadOnly: false,
    hasDefaultValue: false,
    type: "Post",
    relationName: "PostToUser",
    relationFromFields: [],
    relationToFields: [],
    isGenerated: false,
    isUpdatedAt: false,
  };
  const addRelationField = new AddOrUpdateFieldCommand(
    "User",
    oneToOneFieldObject
  );

  dmmfModifierOneToOne.do(addRelationField);

  const addedField = dmmfModifierOneToOne
    .get()
    .models.find((m) => m.name === "User")
    ?.fields.find((f) => f.name === "post");

  expect(addedField).toEqual(oneToOneFieldObject);

  const foreignTableObjectField = dmmfModifierOneToOne
    .get()
    .models.find((m) => m.name === "Post")
    ?.fields.find((f) => f.name === "user");

  expect(foreignTableObjectField).toEqual({
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
  });

  const foreignTableKeyField = dmmfModifierOneToOne
    .get()
    .models.find((m) => m.name === "Post")
    ?.fields.find((f) => f.name === "userId");

  expect(foreignTableKeyField).toEqual({
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
  });
});

test("add one to many relation", () => {
  const dmmfModifierOneToMany = new DMMfModifier(dmmfExampleToTestRelation);
  const oneToOneFieldObject: DMMF.Field = {
    name: "posts",
    kind: "object",
    isList: true,
    isRequired: true,
    isUnique: false,
    isId: false,
    isReadOnly: false,
    hasDefaultValue: false,
    type: "Post",
    relationName: "PostToUser",
    relationFromFields: [],
    relationToFields: [],
    isGenerated: false,
    isUpdatedAt: false,
  };
  const addRelationField = new AddOrUpdateFieldCommand(
    "User",
    oneToOneFieldObject
  );

  dmmfModifierOneToMany.do(addRelationField);

  const addedField = dmmfModifierOneToMany
    .get()
    .models.find((m) => m.name === "User")
    ?.fields.find((f) => f.name === "posts");

  expect(addedField).toEqual(oneToOneFieldObject);

  const foreignTableObjectField = dmmfModifierOneToMany
    .get()
    .models.find((m) => m.name === "Post")
    ?.fields.find((f) => f.name === "user");

  expect(foreignTableObjectField).toEqual({
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
  });

  const foreignTableKeyField = dmmfModifierOneToMany
    .get()
    .models.find((m) => m.name === "Post")
    ?.fields.find((f) => f.name === "userId");

  expect(foreignTableKeyField).toEqual({
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
  });
});

test("add many to many relation", () => {
  const dmmfModifierOneToMany = new DMMfModifier(dmmfExampleToTestRelation);
  const oneToOneFieldObject: DMMF.Field = {
    name: "posts",
    kind: "object",
    isList: true,
    isRequired: true,
    isUnique: false,
    isId: false,
    isReadOnly: false,
    hasDefaultValue: false,
    type: "Post",
    relationName: "PostToUser",
    relationFromFields: [],
    relationToFields: [],
    isGenerated: false,
    isUpdatedAt: false,
  };
  const addRelationField = new AddOrUpdateFieldCommand(
    "User",
    oneToOneFieldObject,
    true
  );

  dmmfModifierOneToMany.do(addRelationField);

  const addedField = dmmfModifierOneToMany
    .get()
    .models.find((m) => m.name === "User")
    ?.fields.find((f) => f.name === "posts");

  expect(addedField).toEqual(oneToOneFieldObject);

  const foreignTableObjectField = dmmfModifierOneToMany
    .get()
    .models.find((m) => m.name === "Post")
    ?.fields.find((f) => f.name === "user");

  expect(foreignTableObjectField).toEqual({
    name: "user",
    kind: "object",
    isList: true,
    isRequired: true,
    isUnique: false,
    isId: false,
    isReadOnly: false,
    hasDefaultValue: false,
    type: "User",
    relationName: "PostToUser",
    relationFromFields: [],
    relationToFields: [],
    isGenerated: false,
    isUpdatedAt: false,
  });

  const foreignTableKeyField = dmmfModifierOneToMany
    .get()
    .models.find((m) => m.name === "Post")
    ?.fields.find((f) => f.name === "userId");

  expect(foreignTableKeyField).toEqual({
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
  });
});
