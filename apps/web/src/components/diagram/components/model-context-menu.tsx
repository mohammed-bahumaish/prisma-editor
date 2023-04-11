import { type FC, type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import AddOrUpdateModelFieldDialog from "./add-or-update-model-field-dialog";
import AddOrUpdateModelDialog from "./add-or-update-model-dialog";
import { createSchemaStore } from "~/components/store/schemaStore";
import { shallow } from "zustand/shallow";

const ModelContextMenu: FC<{ children: ReactNode; model: string }> = ({
  children,
  model,
}) => {
  const { removeDmmfModel } = createSchemaStore(
    (state) => ({
      removeDmmfModel: state.removeDmmfModel,
    }),
    shallow
  );
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
        <ContextMenuItem
          inset
          onSelect={() => {
            void removeDmmfModel(model);
          }}
        >
          Remove Model
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ModelContextMenu;
