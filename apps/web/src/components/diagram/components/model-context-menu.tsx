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
import AddOrUpdateModelDialogContent from "./add-or-update-model-dialog-content";
import AddOrUpdateModelFieldDialogContent from "./add-or-update-model-field-dialog-content";

const ModelContextMenu: FC<{ children: ReactNode; model: string }> = ({
  children,
  model,
}) => {
  const { removeDmmfModel, permission } = useSchemaStore()(
    (state) => ({
      removeDmmfModel: state.removeDmmfModel,
      permission: state.permission,
    }),
    shallow
  );
  const readOnly = permission === "VIEW";

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
            onSelect={() => {
              void removeDmmfModel(model);
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
