import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";
import { useSchemaStore } from "~/components/store/schemaStore";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { TextInputField } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const AddOrUpdateEnumDialogContent = ({
  enumName,
  onAdded,
}: {
  enumName?: string;
  onAdded: () => void;
}) => {
  const [oldName] = useState(enumName);

  const { addEnum } = useSchemaStore()(
    (state) => ({
      addEnum: state.addEnum,
    }),
    shallow
  );

  const methods = useForm<{ enumName: string }>({
    defaultValues: {
      enumName: enumName || "",
    },
    resolver: zodResolver(
      z.object({
        enumName: z.string().refine((n) => /^[A-Za-z][A-Za-z0-9_]*$/i.test(n), {
          message: "invalid",
        }),
      })
    ),
  });
  const { handleSubmit, reset } = methods;

  const handleAdd = handleSubmit((data) => {
    void addEnum(data.enumName, oldName);
    if (!oldName) reset();
    onAdded();
  });
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {enumName ? `Update ${enumName} enum` : `Add a Enum`}
        </DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleAdd}>
            <TextInputField name="enumName" label="Enum Name" />

            <Button type="submit" className="mt-5 w-full">
              {enumName ? "Update" : "Add"}
            </Button>
          </form>
        </FormProvider>
      </DialogHeader>
    </DialogContent>
  );
};

export default AddOrUpdateEnumDialogContent;
