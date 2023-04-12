import { useState, type FC, type ReactNode } from "react";
import { shallow } from "zustand/shallow";
import { createSchemaStore } from "~/components/store/schemaStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { Dialog } from "~/components/ui/dialog";
import AddOrUpdateEnumFieldDialogContent from "./add-or-update-enum-field-dialog-content";

const EnumFieldContextMenu: FC<{
  children: ReactNode;
  model: string;
  field: string;
}> = ({ children, model, field }) => {
  const { removeEnumField } = createSchemaStore(
    (state) => ({
      removeEnumField: state.removeEnumField,
    }),
    shallow
  );

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
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem
            inset
            onSelect={() => {
              setSelectedDialog("updateField");
            }}
          >
            Update Field
          </ContextMenuItem>

          <ContextMenuItem
            inset
            onSelect={() => {
              void removeEnumField(model, field);
            }}
          >
            Remove Field
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <AddOrUpdateEnumFieldDialogContent
        model={model}
        field={field}
        onAdded={() => setSelectedDialog(null)}
      />
    </Dialog>
  );
};

export default EnumFieldContextMenu;
