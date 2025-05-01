import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AddEnumCommand,
  DMMfModifier,
} from "@mohammed-bahumaish/prisma-dmmf-modifier";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { TextInputField } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { apiClient } from "~/utils/api";
import { replaceTextDocContent } from "app/schema/[id]/doc-utils";

const AddOrUpdateEnumDialogContent = ({
  enumName,
  onAdded,
}: {
  enumName?: string;
  onAdded: () => void;
}) => {
  const [oldName] = useState(enumName);

  const { getDmmf, ydoc } = useYDoc();

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

  const handleAdd = handleSubmit(async (data) => {
    const dmmf = await getDmmf();
    if (dmmf?.datamodel) {
      const dMMfModifier = new DMMfModifier(dmmf.datamodel);
      const addCommand = new AddEnumCommand(data.enumName, oldName);
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
