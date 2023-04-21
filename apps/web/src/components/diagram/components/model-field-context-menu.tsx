import { useState, type FC, type ReactNode } from "react";
import { shallow } from "zustand/shallow";
import { useSchemaStore } from "~/components/store/schemaStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { cn } from "~/components/ui/lib/cn";
import { type ModelNodeData } from "../util/types";
import AddOrUpdateModelFieldDialog from "./add-or-update-model-field-dialog-content";
import { Dialog } from "~/components/ui/dialog";

const ModelFieldContextMenu: FC<{
  children: ReactNode;
  model: string;
  field: ModelNodeData["columns"][0];
}> = ({ children, model, field }) => {
  const { removeDmmfField, permission } = useSchemaStore()(
    (state) => ({
      removeDmmfField: state.removeDmmfField,
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
            onSelect={() => {
              void removeDmmfField(model, field.name);
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
