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

const AddModelFieldForm = ({
  initialValues,
  handleAdd,
  model,
}: {
  initialValues?: ModelNodeData["columns"][0];
  handleAdd: (values: addFieldProps) => void;
  model: string;
}) => {
  const { dmmf } = createSchemaStore(
    (state) => ({
      dmmf: state.dmmf,
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

  const methods = useForm<addFieldProps>({
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
    },
  });
  const { handleSubmit, reset, watch, setValue } = methods;

  const isModelRelation = modelsNames.includes(watch("type"));
  const isEnumRelation = enumsNames.includes(watch("type"));

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
