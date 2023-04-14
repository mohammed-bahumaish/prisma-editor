import {
  DMMfModifier,
  RelationManager,
} from "@prisma-editor/prisma-dmmf-modifier";
import { type FC, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { shallow } from "zustand/shallow";
import {
  createSchemaStore,
  type addFieldProps,
} from "~/components/store/schemaStore";
import { Button } from "~/components/ui/button";
import { CheckboxInputField } from "~/components/ui/form/checkbox-input-field";
import { Form } from "~/components/ui/form/form";
import { SelectInputField } from "~/components/ui/form/select-input-field";
import { TextInputField } from "~/components/ui/form/text-input-field";
import { type ModelNodeData } from "../util/types";

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

  const [modelsNames, enumsNames, getEnumOptions] = useMemo(() => {
    const dmmfModifier = new DMMfModifier(dmmf);
    const modelsNames = dmmfModifier.getModelsNames();
    const enumsNames = dmmfModifier.getEnumsNames();
    const getEnumOptions = (enumName: string) =>
      dmmfModifier.getEnumOptions(enumName);
    return [modelsNames, enumsNames, getEnumOptions];
  }, [dmmf]);

  const fieldTypes = useMemo(() => {
    return [
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
    ];
  }, [enumsNames, modelsNames]);

  // // const nativeTypeOptions = getNativeTypesOptions(watch("type"), "postgresql");
  const isMN = useMemo(() => {
    if (initialValues?.name && modelsNames.includes(initialValues.type)) {
      const relationManager = new RelationManager(
        dmmf,
        model,
        initialValues.name
      );
      if (relationManager.getRelationTypeName() === "n-m") {
        return true;
      }
    }
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.name, modelsNames]);

  const handle = (data: addFieldProps) => {
    console.log({ data });
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

    if (modelsNames.includes(data.type)) {
      field.kind = "object";
    } else if (enumsNames.includes(data.type)) {
      field.kind = "enum";
    } else {
      field.kind = "scalar";
    }

    handleAdd(field);
  };

  return (
    <Form<addFieldProps>
      onSubmit={handle}
      schema={z.any()}
      defaultValues={{
        isList: initialValues?.isList,
        isRequired: initialValues?.isRequired,
        isUnique: initialValues?.isUnique,
        isId: initialValues?.isId,
        type: (initialValues?.type as addFieldProps["type"]) || "String",
        name: initialValues?.name,
        isManyToManyRelation: isMN,
        default: initialValues?.default || "undefined",
      }}
    >
      <div className="flex flex-col gap-4 text-start">
        <TextInputField
          label="Field Name"
          placeholder="firstName"
          name="name"
        />

        <SelectInputField
          name="type"
          label="Type"
          options={fieldTypes.map((o) => ({ label: o, value: o }))}
        />

        <DefaultValueSelect
          enumsNames={enumsNames}
          getEnumOptions={getEnumOptions}
        />

        <CheckboxFieldSet modelNames={modelsNames} />
      </div>

      <Button type="submit" className="mt-5 w-full">
        {initialValues ? "Update" : "Add"}
      </Button>
    </Form>
  );
};

export default AddModelFieldForm;

const CheckboxFieldSet: FC<{ modelNames: string[] }> = ({ modelNames }) => {
  const { watch, setValue } = useFormContext();
  return (
    <fieldset className="flex flex-wrap gap-8">
      <CheckboxInputField
        name="isId"
        label="Id"
        disabled={watch("isList") === true}
        onCheckedChange={(v) => {
          if (v === false) return;
          setValue("isList", false);
          setValue("isRequired", true);
          setValue("isManyToManyRelation", false);
        }}
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
        disabled={
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          watch("isList") === false || !modelNames.includes(watch("type"))
        }
        onCheckedChange={(v) => console.log({ v })}
      />
    </fieldset>
  );
};

const DefaultValueSelect: FC<{
  enumsNames: string[];
  getEnumOptions: (enumName: string) => string[];
}> = ({ enumsNames, getEnumOptions }) => {
  const { watch } = useFormContext();
  const type = watch("type") as string;

  const options = useMemo(() => {
    return typeof defaultOptions[type as keyof typeof defaultOptions] !==
      "undefined"
      ? [
          { label: "No default value", value: "undefined" },
          ...defaultOptions[type as keyof typeof defaultOptions],
        ]
      : // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      enumsNames.includes(type)
      ? [
          { label: "No default value", value: "undefined" },
          ...getEnumOptions(type).map((option) => ({
            value: option,
            label: option,
          })),
        ]
      : [];
  }, [enumsNames, getEnumOptions, type]);

  if (options.length === 0) return null;
  return (
    <SelectInputField name="default" label="Default value" options={options} />
  );
};
