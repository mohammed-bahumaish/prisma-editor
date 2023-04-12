import { useState, type FC, type ReactNode } from "react";
import { shallow } from "zustand/shallow";
import { createSchemaStore } from "~/components/store/schemaStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import AddOrUpdateEnumDialogContent from "./add-or-update-enum-dialog-content";
import AddOrUpdateEnumFieldDialogContent from "./add-or-update-enum-field-dialog-content";
import { Dialog } from "~/components/ui/dialog";

const EnumContextMenu: FC<{ children: ReactNode; model: string }> = ({
  children,
  model,
}) => {
  const { removeEnum } = createSchemaStore(
    (state) => ({
      removeEnum: state.removeEnum,
    }),
    shallow
  );

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
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem
            inset
            onSelect={() => {
              setSelectedDialog("updateModel");
            }}
          >
            Update Model
          </ContextMenuItem>

          <ContextMenuItem
            inset
            onSelect={() => {
              setSelectedDialog("addField");
            }}
          >
            Add Field
          </ContextMenuItem>
          <ContextMenuItem
            inset
            onSelect={() => {
              void removeEnum(model);
            }}
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
