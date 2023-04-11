import { type FC, type ReactNode } from "react";
import { shallow } from "zustand/shallow";
import { createSchemaStore } from "~/components/store/schemaStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import AddOrUpdateModelFieldDialog from "./add-or-update-model-field-dialog";
import { type ModelNodeData } from "../util/types";

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
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <AddOrUpdateModelFieldDialog model={model} field={field}>
          <ContextMenuItem
            inset
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Update Field
          </ContextMenuItem>
        </AddOrUpdateModelFieldDialog>

        <ContextMenuItem
          inset
          onSelect={() => {
            void removeDmmfField(model, field.name);
          }}
        >
          Remove Field
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ModelFieldContextMenu;
