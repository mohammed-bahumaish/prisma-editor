import { type FC, type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import AddOrUpdateEnumFieldDialog from "./add-or-update-enum-field-dialog";

const EnumContextMenu: FC<{ children: ReactNode; model: string }> = ({
  children,
  model,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {/* <AddOrUpdateModelDialog model={model}>
          <ContextMenuItem
            inset
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Update Model
          </ContextMenuItem>
        </AddOrUpdateModelDialog> */}
        <AddOrUpdateEnumFieldDialog model={model}>
          <ContextMenuItem
            inset
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Add Field
          </ContextMenuItem>
        </AddOrUpdateEnumFieldDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default EnumContextMenu;
