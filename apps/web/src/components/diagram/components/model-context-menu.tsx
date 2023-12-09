import {
  DMMfModifier,
  RemoveModelCommand,
} from "@prisma-editor/prisma-dmmf-modifier";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { useState, type FC, type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { Dialog } from "~/components/ui/dialog";
import AddOrUpdateModelDialogContent from "./add-or-update-model-dialog-content";
import AddOrUpdateModelFieldDialogContent from "./add-or-update-model-field-dialog-content";
import { apiClient } from "~/utils/api";
import { replaceTextDocContent } from "app/schema/[id]/doc-utils";

const ModelContextMenu: FC<{ children: ReactNode; model: string }> = ({
  children,
  model,
}) => {
  const { getDmmf, ydoc } = useYDoc();

  const readOnly = "todo" === "VIEW";

  const [selectedDialog, setSelectedDialog] = useState<
    "updateModel" | "addField" | null
  >(null);

  return (
    <Dialog
      open={selectedDialog !== null}
      onOpenChange={(open) => {
        if (open === false) setSelectedDialog(null);
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger>{children} </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem
            inset
            onSelect={() => {
              setSelectedDialog("updateModel");
            }}
            disabled={readOnly}
          >
            Update Model
          </ContextMenuItem>
          <ContextMenuItem
            inset
            onSelect={() => {
              setSelectedDialog("addField");
            }}
            disabled={readOnly}
          >
            Add Field
          </ContextMenuItem>
          <ContextMenuItem
            inset
            onSelect={async () => {
              const dmmf = await getDmmf();
              if (dmmf?.datamodel) {
                const dMMfModifier = new DMMfModifier(dmmf.datamodel);
                const addCommand = new RemoveModelCommand(model);
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
            Remove Model
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {selectedDialog === "updateModel" ? (
        <AddOrUpdateModelDialogContent
          model={model}
          onAdded={() => setSelectedDialog(null)}
        />
      ) : (
        selectedDialog === "addField" && (
          <AddOrUpdateModelFieldDialogContent
            model={model}
            onAdded={() => setSelectedDialog(null)}
          />
        )
      )}
    </Dialog>
  );
};

export default ModelContextMenu;
