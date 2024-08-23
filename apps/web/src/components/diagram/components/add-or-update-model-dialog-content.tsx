import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddModelCommand,
  DMMfModifier,
} from "@prisma-editor/prisma-dmmf-modifier";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { replaceTextDocContent } from "app/schema/[id]/doc-utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { TextInputField } from "~/components/ui/form";
import { apiClient } from "~/utils/api";

const AddOrUpdateModelDialogContent = ({
  model,
  onAdded,
}: {
  model?: string;
  onAdded: () => void;
}) => {
  const [oldName] = useState(model);
  const { ydoc, getDmmf } = useYDoc();

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

  const handleAdd = handleSubmit(async (data) => {
    const dmmf = await getDmmf();
    if (dmmf?.datamodel) {
      const dMMfModifier = new DMMfModifier(dmmf.datamodel);
      const addCommand = new AddModelCommand(data.model, oldName);
      dMMfModifier.do(addCommand);
      const schema = await apiClient.dmmf.dmmfToPrismaSchema.mutate({
        dmmf: dMMfModifier.get(),
        config: dmmf.config,
      });
      replaceTextDocContent(ydoc.getText("schema"), schema);
    }
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
