import { DMMfModifier } from "@prisma-editor/prisma-dmmf-modifier";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { CheckboxField } from "~/components/inputFields";
import TextInputField from "~/components/inputFields/textInputField";
import {
  createSchemaStore,
  type addFieldProps,
} from "~/components/store/schemaStore";
import { type ModelNodeData } from "../util/types";

const AddFieldForm = ({
  initialValues,
  handleAdd,
  handleRemove,
  setOpen,
  model,
}: {
  initialValues?: ModelNodeData["columns"][0];
  handleAdd: (values: addFieldProps) => void;
  handleRemove: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  model: string;
}) => {
  const { dmmf, getIsManyToManyRelation } = createSchemaStore((state) => ({
    dmmf: state.dmmf,
    getIsManyToManyRelation: state.getIsManyToManyRelation,
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
      isManyToManyRelation: initialValues?.name
        ? getIsManyToManyRelation(model, initialValues.name)
        : false,
    },
  });

  const isRelation = modelsNames.includes(watch("type"));

  return (
    <form
      onSubmit={async (e) => {
        await handleSubmit(handleAdd)(e);
        if (!initialValues) reset();
      }}
    >
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
                setValue("isManyToManyRelation", false);
              }}
              disabled={watch("isList") === true}
            />

            <CheckboxField
              {...register("isRequired")}
              label="Required"
              disabled={
                watch("isId") === true || watch("isList") === true || isRelation
              }
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
              disabled={watch("isList") === false || !isRelation}
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
        {initialValues ? (
          <button
            type="button"
            className="focus:ring-brand-red-1 mt-3 inline-flex w-full justify-center rounded-md border border-gray-800 bg-red-700 px-4 py-2 text-base font-medium text-gray-100 shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            onClick={() => handleRemove()}
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            className="focus:ring-brand-indigo-1 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddFieldForm;
