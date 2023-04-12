import {
  useState,
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (event.key === "m") {
          setSelectedDialog("newModel");
        } else if (event.key === "e") {
          setSelectedDialog("newEnum");
        } else if (event.key === "l") {
          void resetLayout();
        }
        event.preventDefault();
      }
    },
    [resetLayout]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, {
      capture: true,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
            <ContextMenuShortcut>⌘M</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem
            inset
            onSelect={() => {
              setSelectedDialog("newEnum");
            }}
          >
            New Enum
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem inset onClick={() => resetLayout()}>
            Auto Layout
            <ContextMenuShortcut>⌘L</ContextMenuShortcut>
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
