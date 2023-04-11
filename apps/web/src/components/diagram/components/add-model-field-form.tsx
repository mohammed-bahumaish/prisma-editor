import {
  DMMfModifier,
  RelationManager,
} from "@prisma-editor/prisma-dmmf-modifier";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";
import { CheckboxField } from "~/components/inputFields";
import TextInputField from "~/components/inputFields/textInputField";
import {
  createSchemaStore,
  type addFieldProps,
} from "~/components/store/schemaStore";
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
  handleRemove,
  model,
}: {
  initialValues?: ModelNodeData["columns"][0];
  handleAdd: (values: addFieldProps) => void;
  handleRemove: () => void;
  model: string;
}) => {
  const { dmmf } = createSchemaStore(
    (state) => ({
      dmmf: state.dmmf,
    }),
    shallow
  );

  const dmmfModifier = new DMMfModifier(dmmf);
  const modelsNames = dmmfModifier.getModelsNames();
  const enumsNames = dmmfModifier.getEnumsNames();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<addFieldProps>({
    defaultValues: {
      isList: initialValues?.isList,
      isRequired: initialValues?.isRequired,
      isUnique: initialValues?.isUnique,
      isId: initialValues?.isId,
      type: initialValues?.type || "String",
      name: initialValues?.name,
      isManyToManyRelation: false,
      default: initialValues?.default || "undefined",
    },
  });

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

  const options =
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
      : [];

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
    <form onSubmit={handle}>
      <div className="flex flex-col gap-4 text-start">
        <TextInputField
          label="Field Name"
          placeholder="firstName"
          {...register("name", {
            required: "Field name is required",
            pattern: /^(?![0-9])[A-Za-z0-9]*$/i,
          })}
          error={errors.name?.message}
        />

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-white"
          >
            Type
          </label>
          <select
            id="type"
            className="focus:ring-brand-indigo-1 focus:border-brand-indigo-1 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
            defaultValue={fieldTypes[0]}
            {...register("type", { required: true })}
            disabled={
              !!initialValues?.name && (isModelRelation || isEnumRelation)
            }
          >
            {fieldTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {options.length > 0 && (
          <div>
            <label
              htmlFor="default"
              className="block text-sm font-medium text-white"
            >
              Default value
            </label>
            <select
              id="default"
              className="focus:ring-brand-indigo-1 focus:border-brand-indigo-1 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
              defaultValue={fieldTypes[0]}
              {...register("default")}
            >
              {options.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <fieldset className="flex flex-wrap gap-8">
            <CheckboxField
              {...register("isId")}
              label="Id"
              onChange={(e) => {
                void register("isId").onChange(e);
                setValue("isList", false);
                setValue("isRequired", true);
                setValue("isManyToManyRelation", false);
              }}
              disabled={watch("isList") === true}
            />

            <CheckboxField
              {...register("isRequired")}
              label="Required"
              disabled={watch("isId") === true || watch("isList") === true}
            />
            <CheckboxField {...register("isUnique")} label="Unique" />

            <CheckboxField
              {...register("isList")}
              label="List"
              disabled={watch("isId") === true}
              onChange={(e) => {
                void register("isList").onChange(e);
                setValue("isId", false);
                setValue("isRequired", true);
                setValue("isManyToManyRelation", false);
              }}
            />
            <CheckboxField
              {...register("isManyToManyRelation")}
              label="Many To Many Relation"
              disabled={watch("isList") === false || !isModelRelation}
            />
          </fieldset>
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          className="bg-brand-indigo-1 hover:bg-brand-indigo-1 focus:ring-brand-indigo-1 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
        >
          {initialValues ? "Update" : "Add"}
        </button>

        {initialValues && (
          <button
            type="button"
            className="focus:ring-brand-red-1 mt-3 inline-flex w-full justify-center rounded-md border border-gray-800 bg-red-700 px-4 py-2 text-base font-medium text-gray-100 shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            onClick={() => handleRemove()}
          >
            Remove
          </button>
        )}
      </div>
    </form>
  );
};

export default AddModelFieldForm;
