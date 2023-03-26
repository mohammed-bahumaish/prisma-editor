import { DMMfModifier } from "@prisma-editor/prisma-dmmf-modifier";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { CheckboxField } from "~/components/inputFields";
import {
  createSchemaStore,
  type addFieldProps,
} from "~/components/store/schemaStore";
import { type ModelNodeData } from "../util/types";

const AddFieldForm = ({
  initialValues,
  handleAdd,
}: {
  initialValues?: ModelNodeData["columns"][0];
  handleAdd: (values: addFieldProps) => void;
}) => {
  const { dmmf } = createSchemaStore((state) => ({
    dmmf: state.dmmf,
  }));

  const dmmfModifier = new DMMfModifier(dmmf);
  const modelsNames = dmmfModifier.getModelsNames();

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
    ],
    [modelsNames]
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
      type: initialValues?.type,
      name: initialValues?.name,
    },
  });
  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(handleAdd)(e);
        reset();
      }}
    >
      <div className="flex flex-col gap-4 text-start">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Field Name
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              id="name"
              className="focus:ring-brand-indigo-1 focus:border-brand-indigo-1 block w-full rounded-md border-gray-300 sm:text-sm"
              placeholder="firstName"
              {...register("name", {
                required: "Field name is required",
                pattern: /^[A-Za-z1-9]+$/i,
              })}
            />
          </div>
          <p className="text-red-500">
            {errors.name?.type === "required" && (
              <p role="alert">{errors.name?.message as string}</p>
            )}
            {errors.name?.type === "pattern" && <p role="alert">Invalid</p>}
          </p>
        </div>
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
          >
            {fieldTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <fieldset className="flex flex-wrap gap-8">
            <CheckboxField
              {...register("isId")}
              label="Id"
              onChange={(e) => {
                void register("isId").onChange(e);
                setValue("isList", false);
                setValue("isRequired", true);
              }}
              disabled={watch("isList") === true}
            />
            <CheckboxField
              {...register("isList")}
              label="List"
              disabled={watch("isId") === true}
              onChange={(e) => {
                void register("isList").onChange(e);
                setValue("isId", false);
                setValue("isRequired", true);
              }}
            />
            <CheckboxField
              {...register("isRequired")}
              label="Required"
              disabled={watch("isId") === true || watch("isList") === true}
            />
            <CheckboxField {...register("isUnique")} label="Unique" />
          </fieldset>
        </div>
      </div>
    </form>
  );
};

export default AddFieldForm;
