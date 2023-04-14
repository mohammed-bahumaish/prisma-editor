import {
  DMMfModifier,
  RelationManager,
} from "@prisma-editor/prisma-dmmf-modifier";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";
import {
  createSchemaStore,
  type addFieldProps,
} from "~/components/store/schemaStore";
import { type ModelNodeData } from "../util/types";
import { Button } from "~/components/ui/button";
import {
  SelectInputField,
  CheckboxInputField,
  TextInputField,
} from "~/components/ui/form";
import { getNativeTypes } from "@prisma-editor/prisma-dmmf-modifier";

const defaultOptions = {
  Int: [{ label: "Automatic Incrimination", value: "autoincrement()" }],
  String: [
    { label: "Random CUID", value: "cuid()" },
    { label: "Random UUID", value: "uuid()" },
  ],
  DateTime: [
    { label: "Created At", value: "now()" },
    { label: "Updated At", value: "updatedAt()" },
  ],
  Boolean: [
    { label: "True", value: "true" },
    { label: "False", value: "false" },
  ],
};

function extractNativeType(s?: string) {
  if (!s) return { native: "undefined", x: "", y: "" };
  const parts = s.split("(");
  if (typeof parts[1] === "undefined") return { native: s, x: "", y: "" };
  s = `(${parts[1]}`;
  // Remove any whitespace from the string
  s = s.replace(/\s/g, "");

  // Extract the numbers from the string using a regular expression
  const matches = s.match(/\((\d+)(?:,(\d+))?\)/);

  // If the regular expression doesn't match, throw an error
  if (!matches) {
    return { native: s, x: "", y: "" };
  }

  // Extract the numbers from the regex matches and parse them as integers
  const x = matches[1] || "";
  const y = matches[2] || "";

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const native = `${parts[0]}${y ? "(p, s)" : "(x)"}`;

  return { x, y, native };
}

const AddModelFieldForm = ({
  initialValues,
  handleAdd,
  model,
}: {
  initialValues?: ModelNodeData["columns"][0];
  handleAdd: (values: addFieldProps) => void;
  model: string;
}) => {
  const { dmmf, getConnectorType } = createSchemaStore(
    (state) => ({
      dmmf: state.dmmf,
      getConnectorType: state.getConnectorType,
    }),
    shallow
  );

  const [dmmfModifier, modelsNames, enumsNames] = useMemo(() => {
    const dmmfModifier = new DMMfModifier(dmmf);
    const modelsNames = dmmfModifier.getModelsNames();
    const enumsNames = dmmfModifier.getEnumsNames();
    return [dmmfModifier, modelsNames, enumsNames];
  }, [dmmf]);

  const fieldTypes = useMemo(
    () => [
      "String",
      "Int",
      "Boolean",
      "Float",
      "DateTime",
      "Decimal",
      "BigInt",
      "Bytes",
      "JSON",
      ...modelsNames,
      ...enumsNames,
    ],
    [modelsNames, enumsNames]
  );
  const extractedNative = extractNativeType(initialValues?.native);
  const methods = useForm<addFieldProps & { x: string; y: string }>({
    defaultValues: {
      isList: initialValues?.isList,
      isRequired: initialValues?.isRequired,
      isUnique: initialValues?.isUnique,
      isId: initialValues?.isId,
      type:
        (initialValues?.type as
          | "String"
          | "Int"
          | "Boolean"
          | "Float"
          | "DateTime"
          | "Decimal"
          | "BigInt"
          | "Bytes"
          | "JSON") || "String",
      name: initialValues?.name,
      isManyToManyRelation: false,
      default: initialValues?.default || "undefined",
      native: extractedNative.native || "undefined",
      x: extractedNative.x,
      y: extractedNative.y,
    },
  });
  const { handleSubmit, reset, watch, setValue } = methods;

  const isModelRelation = modelsNames.includes(watch("type"));
  const isEnumRelation = enumsNames.includes(watch("type"));
  const native = getNativeTypes(getConnectorType(), watch("type"));

  useEffect(() => {
    if (initialValues?.name && isModelRelation) {
      const relationManager = new RelationManager(
        dmmf,
        model,
        initialValues.name
      );
      if (relationManager.getRelationTypeName() === "n-m") {
        setValue("isManyToManyRelation", true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () =>
      typeof defaultOptions[watch("type") as keyof typeof defaultOptions] !==
      "undefined"
        ? [
            { label: "No default value", value: "undefined" },
            ...defaultOptions[watch("type") as keyof typeof defaultOptions],
          ]
        : isEnumRelation
        ? [
            { label: "No default value", value: "undefined" },
            ...dmmfModifier
              .getEnumOptions(watch("type"))
              .map((option) => ({ value: option, label: option })),
          ]
        : [],
    [dmmfModifier, isEnumRelation, watch]
  );

  const handle = handleSubmit((data) => {
    const field = {
      ...data,
    };

    if (
      data.default &&
      ["autoincrement()", "cuid()", "uuid()", "now()"].includes(
        data.default as string
      )
    ) {
      field.default = {
        name: (data.default as string).replace("()", ""),
        args: [],
      };
    } else if (
      data.default &&
      ["true", "false"].includes(data.default as string)
    ) {
      field.default = data.default === "true" ? true : false;
    } else if (field.default && data.default === "undefined")
      field.default = undefined;
    else if (field.default === "updatedAt()") {
      field.default = undefined;
      field.isUpdatedAt = true;
    }

    if (isModelRelation) {
      field.kind = "object";
    } else if (isEnumRelation) {
      field.kind = "enum";
    } else {
      field.kind = "scalar";
    }

    if (field.native?.includes("(x)")) {
      field.native = field.native.replace("(x)", `(${field.x})`);
    } else if (field.native?.includes("(p, s)")) {
      field.native = field.native.replace("(p, s)", `(${field.x}, ${field.y})`);
    } else if (field.native && data.native === "undefined")
      field.native = undefined;

    handleAdd(field);
    if (!initialValues?.name) reset();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handle}>
        <div className="flex flex-col gap-4 text-start">
          <TextInputField
            name="name"
            label="Field Name"
            placeholder="firstName"
          />

          <SelectInputField
            name="type"
            label="Type"
            options={fieldTypes.map((o) => ({ label: o, value: o }))}
          />

          {native.length > 0 && (
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <SelectInputField
                  name="native"
                  label="Native type"
                  options={[
                    { label: "No native type", value: "undefined" },
                    ...native.map((o) => ({ label: o, value: o })),
                  ]}
                />
              </div>
              {watch("native")?.includes("(x)") && (
                <div className="col-span-6">
                  <TextInputField name="x" label="X" />
                </div>
              )}
              {watch("native")?.includes("(p, s)") && (
                <>
                  <div className="col-span-3">
                    <TextInputField name="x" label="P" />
                  </div>
                  <div className="col-span-3">
                    <TextInputField name="y" label="S" />
                  </div>
                </>
              )}
            </div>
          )}

          {options.length > 0 && (
            <SelectInputField
              name="default"
              label="Default value"
              options={options}
            />
          )}
          <div>
            <fieldset className="flex flex-wrap gap-8">
              <CheckboxInputField
                name="isId"
                label="Id"
                onCheckedChange={(v) => {
                  if (v === false) return;

                  setValue("isList", false);
                  setValue("isRequired", true);
                  setValue("isManyToManyRelation", false);
                }}
                disabled={watch("isList") === true}
              />

              <CheckboxInputField
                name="isRequired"
                label="Required"
                disabled={watch("isId") === true || watch("isList") === true}
              />
              <CheckboxInputField name="isUnique" label="Unique" />
              {/* disable for mysql in primitive types */}
              <CheckboxInputField
                name="isList"
                label="List"
                disabled={watch("isId") === true}
                onCheckedChange={(v) => {
                  if (v === false) return;
                  setValue("isId", false);
                  setValue("isRequired", true);
                  setValue("isManyToManyRelation", false);
                }}
              />
              <CheckboxInputField
                name="isManyToManyRelation"
                label="Many To Many Relation"
                disabled={watch("isList") === false || !isModelRelation}
              />
            </fieldset>
          </div>
        </div>

        <Button type="submit" className="mt-5 w-full">
          {initialValues ? "Update" : "Add"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default AddModelFieldForm;
