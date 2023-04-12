import { useForm } from "react-hook-form";
import TextInputField from "~/components/inputFields/textInputField";
import { Button } from "~/components/ui/button";

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

      <Button type="submit" className="mt-5 w-full">
        {initialName ? "Update" : "Add"}
      </Button>
    </form>
  );
};

export default AddEnumFieldForm;
