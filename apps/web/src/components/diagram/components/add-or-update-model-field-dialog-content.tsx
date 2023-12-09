import {
  AddFieldCommand,
  DMMfModifier,
  UpdateFieldCommand,
} from "@prisma-editor/prisma-dmmf-modifier";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { useState } from "react";
import { type addFieldProps } from "~/components/store/schemaStore";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { type ModelNodeData } from "../util/types";
import AddModelFieldForm from "./add-model-field-form";
import { replaceTextDocContent } from "app/schema/[id]/doc-utils";
import { apiClient } from "~/utils/api";

const AddOrUpdateModelFieldDialogContent = ({
  model,
  field,
  onAdded,
}: {
  model: string;
  field?: ModelNodeData["columns"][0];
  onAdded: () => void;
}) => {
  const [oldName] = useState(field?.name);

  const { getDmmf, ydoc } = useYDoc();

  const handleAdd = async (data: addFieldProps) => {
    // void updateDmmfField(model, oldName, data);
    const dmmf = await getDmmf();
    if (dmmf?.datamodel) {
      const dMMfModifier = new DMMfModifier(dmmf.datamodel);
      if (oldName) {
        const addCommand = new UpdateFieldCommand(
          model,
          oldName,
          {
            name: data.name,
            kind: data.kind,
            relationName:
              data.kind === "object" ? `${data.type}To${model}` : undefined,
            isList: data.isList,
            isRequired: data.isRequired,
            isUnique: data.isUnique,
            isId: data.isId,
            hasDefaultValue: typeof data.default !== "undefined",
            default: data.default,
            type: data.type,
            isUpdatedAt: data.isUpdatedAt,
            native: data.native,
          },
          !!data.isManyToManyRelation
        );
        dMMfModifier.do(addCommand);
      } else {
        const addCommand = new AddFieldCommand(
          model,
          {
            name: data.name,
            kind: data.kind,
            relationName:
              data.kind === "object" ? `${data.type}To${model}` : undefined,
            isList: data.isList,
            isRequired: data.isRequired,
            isUnique: data.isUnique,
            isId: data.isId,
            isReadOnly: false,
            hasDefaultValue: typeof data.default !== "undefined",
            ...(typeof data.default !== "undefined"
              ? { default: data.default }
              : {}),
            type: data.type,
            isGenerated: false,
            isUpdatedAt: data.isUpdatedAt,
            ...(typeof data.native !== "undefined"
              ? { native: data.native }
              : {}),
          },
          !!data.isManyToManyRelation
        );
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
          {field ? `Update ${field.name} in ${model}` : `Add field to ${model}`}
        </DialogTitle>

        <AddModelFieldForm
          handleAdd={handleAdd}
          initialValues={field}
          model={model}
        />
      </DialogHeader>
    </DialogContent>
  );
};

export default AddOrUpdateModelFieldDialogContent;
