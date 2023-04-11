import { type FC, type ReactNode } from "react";
import { shallow } from "zustand/shallow";
import { createSchemaStore } from "~/components/store/schemaStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import AddOrUpdateEnumFieldDialog from "./add-or-update-enum-field-dialog";

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
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <AddOrUpdateEnumFieldDialog model={model} field={field}>
          <ContextMenuItem
            inset
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Update Field
          </ContextMenuItem>
        </AddOrUpdateEnumFieldDialog>

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
  );
};

export default EnumFieldContextMenu;
