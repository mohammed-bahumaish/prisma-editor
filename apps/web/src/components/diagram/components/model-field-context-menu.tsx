import { useState, type FC, type ReactNode } from "react";
import { shallow } from "zustand/shallow";
import { createSchemaStore } from "~/components/store/schemaStore";
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
  const { removeDmmfField } = createSchemaStore(
    (state) => ({
      removeDmmfField: state.removeDmmfField,
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
        <ContextMenuTrigger>
          <div onClick={() => setSelectedDialog("updateField")}>{children}</div>
        </ContextMenuTrigger>
        <ContextMenuContent className={cn("w-64")}>
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
              void removeDmmfField(model, field.name);
            }}
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
