import { useState, type FC, type ReactNode } from "react";
import { shallow } from "zustand/shallow";
import { createSchemaStore } from "~/components/store/schemaStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { Dialog } from "~/components/ui/dialog";
import AddOrUpdateEnumDialogContent from "./add-or-update-enum-dialog-content";
import AddOrUpdateModelDialogContent from "./add-or-update-model-dialog-content";

const DiagramContextMenu: FC<{ children: ReactNode }> = ({ children }) => {
  const { resetLayout } = createSchemaStore(
    (state) => ({
      resetLayout: state.resetLayout,
    }),
    shallow
  );

  const [selectedDialog, setSelectedDialog] = useState<
    "newModel" | "newEnum" | null
  >(null);

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
              setSelectedDialog("newModel");
            }}
          >
            New Model
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem
            inset
            onSelect={() => {
              setSelectedDialog("newEnum");
            }}
          >
            New Enum
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem inset onClick={() => resetLayout()}>
            Auto Layout
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {selectedDialog === "newModel" ? (
        <AddOrUpdateModelDialogContent
          onAdded={() => setSelectedDialog(null)}
        />
      ) : (
        selectedDialog === "newEnum" && (
          <AddOrUpdateEnumDialogContent
            onAdded={() => setSelectedDialog(null)}
          />
        )
      )}
    </Dialog>
  );
};

export default DiagramContextMenu;
