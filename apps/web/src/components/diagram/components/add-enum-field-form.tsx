import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { TextInputField } from "~/components/ui/form";

const AddEnumFieldForm = ({
  initialName,
  handleAdd,
}: {
  initialName?: string;
  handleAdd: ({ fieldName }: { fieldName: string }) => void;
}) => {
  const methods = useForm<{ fieldName: string }>({
    defaultValues: {
      fieldName: initialName || "",
    },
    resolver: zodResolver(
      z.object({
        fieldName: z
          .string()
          .refine((n) => /^[A-Za-z][A-Za-z0-9_]*$/i.test(n), {
            message: "invalid",
          }),
      })
    ),
  });
  const { register, handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleAdd)}>
        <TextInputField
          label="Field name"
          {...register("fieldName")}
          required
        />

        <Button type="submit" className="mt-5 w-full">
          {initialName ? "Update" : "Add"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default AddEnumFieldForm;
