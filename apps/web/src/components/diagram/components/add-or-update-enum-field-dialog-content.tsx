import {
  AddEnumFieldCommand,
  DMMfModifier,
  UpdateEnumFieldCommand,
} from "@prisma-editor/prisma-dmmf-modifier";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { replaceTextDocContent } from "app/schema/[id]/doc-utils";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { apiClient } from "~/utils/api";
import AddEnumFieldForm from "./add-enum-field-form";

const AddOrUpdateEnumFieldDialogContent = ({
  model,
  field,
  onAdded,
}: {
  model: string;
  field?: string;
  onAdded: () => void;
}) => {
  const { getDmmf, ydoc } = useYDoc();

  const handleAdd = async ({ fieldName }: { fieldName: string }) => {
    const dmmf = await getDmmf();
    if (dmmf?.datamodel) {
      const dMMfModifier = new DMMfModifier(dmmf.datamodel);
      if (field) {
        const updateCommand = new UpdateEnumFieldCommand(
          model,
          fieldName,
          field
        );
        dMMfModifier.do(updateCommand);
      } else {
        const addCommand = new AddEnumFieldCommand(model, fieldName);
        dMMfModifier.do(addCommand);
      }
      const schema = await apiClient.dmmf.dmmfToPrismaSchema.mutate({
        dmmf: dMMfModifier.get(),
        config: dmmf.config,
      });
      replaceTextDocContent(ydoc.getText("schema"), schema);
    }

    onAdded();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {field ? `Update ${field} in ${model}` : `Add field to ${model}`}
        </DialogTitle>
        <AddEnumFieldForm handleAdd={handleAdd} initialName={field} />
      </DialogHeader>
    </DialogContent>
  );
};

export default AddOrUpdateEnumFieldDialogContent;
