import { useState, type FC, type ReactNode } from "react";
import { shallow } from "zustand/shallow";
import { useSchemaStore } from "~/components/store/schemaStore";
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
  const { removeEnumField, permission } = useSchemaStore()(
    (state) => ({
      removeEnumField: state.removeEnumField,
      permission: state.permission,
    }),
    shallow
  );

  const readOnly = permission === "VIEW";

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
        <ContextMenuContent className="w-64">
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
            onSelect={() => {
              void removeEnumField(model, field);
            }}
            className="flex cursor-pointer items-center text-red-600 focus:bg-red-50 dark:focus:bg-red-700/10"
            disabled={readOnly}
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
