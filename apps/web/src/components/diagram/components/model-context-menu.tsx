import { type FC, type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import AddOrUpdateModelFieldDialog from "./add-or-update-model-field-dialog";
import AddOrUpdateModelDialog from "./add-or-update-model-dialog";

const ModelContextMenu: FC<{ children: ReactNode; model: string }> = ({
  children,
  model,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <AddOrUpdateModelDialog model={model}>
          <ContextMenuItem
            inset
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Update Model
          </ContextMenuItem>
        </AddOrUpdateModelDialog>
        <AddOrUpdateModelFieldDialog model={model}>
          <ContextMenuItem
            inset
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Add Field
          </ContextMenuItem>
        </AddOrUpdateModelFieldDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ModelContextMenu;
