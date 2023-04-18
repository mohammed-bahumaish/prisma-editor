import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { shallow } from "zustand/shallow";
import { useSchemaStore } from "~/components/store/schemaStore";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { TextInputField } from "~/components/ui/form";

const AddOrUpdateModelDialogContent = ({
  model,
  onAdded,
}: {
  model?: string;
  onAdded: () => void;
}) => {
  const [oldName] = useState(model);

  const { addDmmfModel } = useSchemaStore()(
    (state) => ({
      addDmmfModel: state.addDmmfModel,
    }),
    shallow
  );

  const methods = useForm<{ model: string }>({
    defaultValues: {
      model: model || "",
    },
    resolver: zodResolver(
      z.object({
        model: z.string().refine((n) => /^[A-Za-z][A-Za-z0-9_]*$/i.test(n), {
          message: "invalid",
        }),
      })
    ),
  });
  const { handleSubmit, reset } = methods;

  const handleAdd = handleSubmit((data) => {
    void addDmmfModel(data.model, oldName);
    if (!oldName) reset();
    onAdded();
  });
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {model ? `Update ${model} model` : `Add a model`}
        </DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleAdd}>
            <TextInputField name="model" label="Model Name" />

            <Button type="submit" className="mt-5 w-full">
              {model ? "Update" : "Add"}
            </Button>
          </form>
        </FormProvider>
      </DialogHeader>
    </DialogContent>
  );
};

export default AddOrUpdateModelDialogContent;
