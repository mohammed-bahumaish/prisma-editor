import {
  DMMfModifier,
  RemoveFieldCommand,
} from "@prisma-editor/prisma-dmmf-modifier";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { replaceTextDocContent } from "app/schema/[id]/doc-utils";
import { useState, type FC, type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { Dialog } from "~/components/ui/dialog";
import { cn } from "~/components/ui/lib/cn";
import { apiClient } from "~/utils/api";
import { type ModelNodeData } from "../util/types";
import AddOrUpdateModelFieldDialog from "./add-or-update-model-field-dialog-content";

const ModelFieldContextMenu: FC<{
  children: ReactNode;
  model: string;
  field: ModelNodeData["columns"][0];
}> = ({ children, model, field }) => {
  const { getDmmf, ydoc, isViewOnly: readOnly } = useYDoc();

  const [selectedDialog, setSelectedDialog] = useState<"updateField" | null>(
    null
  );
  return (
    <Dialog
      open={selectedDialog !== null}
      onOpenChange={(open) => {
        if (open === false) setSelectedDialog(null);
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger>{children} </ContextMenuTrigger>
        <ContextMenuContent className={cn("w-64")}>
          <ContextMenuItem
            inset
            onSelect={() => {
              setSelectedDialog("updateField");
            }}
            disabled={readOnly}
          >
            Update Field
          </ContextMenuItem>

          <ContextMenuItem
            inset
            onSelect={async () => {
              const dmmf = await getDmmf();
              if (dmmf?.datamodel) {
                const dMMfModifier = new DMMfModifier(dmmf?.datamodel);
                const addCommand = new RemoveFieldCommand(model, field.name);
                dMMfModifier.do(addCommand);
                const schema = await apiClient.dmmf.dmmfToPrismaSchema.mutate({
                  dmmf: dMMfModifier.get(),
                  config: dmmf.config,
                });
                replaceTextDocContent(ydoc.getText("schema"), schema);
              }
            }}
            className="flex cursor-pointer items-center text-red-600 focus:bg-red-50 dark:focus:bg-red-700/10"
            disabled={readOnly}
          >
            Remove Field
          </ContextMenuItem>
        </ContextMenuContent>
        <AddOrUpdateModelFieldDialog
          model={model}
          field={field}
          onAdded={() => setSelectedDialog(null)}
        />
      </ContextMenu>
    </Dialog>
  );
};

export default ModelFieldContextMenu;
