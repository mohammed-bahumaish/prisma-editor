import { DMMfModifier } from ".";
import { AddOrUpdateFieldCommand } from "./commands/AddOrUpdateFieldCommand";
import { removeFieldCommand } from "./commands/removeFieldCommand";
import { dmmfExample } from "./__dmmfExample";

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
