import {
  DMMfModifier,
  RemoveEnumCommand
} from "@mohammed-bahumaish/prisma-dmmf-modifier";
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
import { apiClient } from "~/utils/api";
import AddOrUpdateEnumDialogContent from "./add-or-update-enum-dialog-content";
import AddOrUpdateEnumFieldDialogContent from "./add-or-update-enum-field-dialog-content";

const EnumContextMenu: FC<{ children: ReactNode; model: string }> = ({
  children,
  model,
}) => {

  const { isViewOnly: readOnly, getDmmf, ydoc } = useYDoc()

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
                const addCommand = new RemoveEnumCommand(model);
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
            Remove Enum
          </ContextMenuItem>
        </ContextMenuContent>
        {selectedDialog === "updateModel" ? (
          <AddOrUpdateEnumDialogContent
            onAdded={() => setSelectedDialog(null)}
            enumName={model}
          />
        ) : (
          selectedDialog === "addField" && (
            <AddOrUpdateEnumFieldDialogContent
              onAdded={() => setSelectedDialog(null)}
              model={model}
            />
          )
        )}
      </ContextMenu>
    </Dialog>
  );
};

export default EnumContextMenu;
