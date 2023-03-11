import { DMMfModifier } from ".";
import { AddFieldCommand } from "./commands/addFieldCommand";
import { dmmfExample } from "./__dmmfExample";

test("add field command", () => {
  const dmmfModifier = new DMMfModifier(dmmfExample);
  const addField = new AddFieldCommand(
    {
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
    },
    "User"
  );

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
