import { useForm } from "react-hook-form";
import TextInputField from "~/components/inputFields/textInputField";

const AddEnumFieldForm = ({
  initialName,
  handleAdd,
}: {
  initialName?: string;
  handleAdd: ({ fieldName }: { fieldName: string }) => void;
}) => {
  const { register, handleSubmit } = useForm<{ fieldName: string }>({
    defaultValues: {
      fieldName: initialName || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(handleAdd)}>
      <TextInputField label="Field name" {...register("fieldName")} required />
      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          className="bg-brand-indigo-1 hover:bg-brand-indigo-1 focus:ring-brand-indigo-1 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
        >
          {initialName ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
};

export default AddEnumFieldForm;
