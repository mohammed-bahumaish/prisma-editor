import {
  useState,
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { shallow } from "zustand/shallow";
import { useSchemaStore } from "~/components/store/schemaStore";
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
import { useReactFlow } from "reactflow";
import { useDownloadDiagramImage } from "~/hooks/use-download-diagram-image";

const DiagramContextMenu: FC<{ children: ReactNode }> = ({ children }) => {
  const download = useDownloadDiagramImage();
  const reactFlowInstance = useReactFlow();

  const { resetLayout, permission } = useSchemaStore()(
    (state) => ({
      resetLayout: state.resetLayout,
      permission: state.permission,
    }),
    shallow
  );
  const readOnly = permission === "VIEW";

  const autoLayout = useCallback(() => {
    void resetLayout().then(() => reactFlowInstance.fitView());
  }, [reactFlowInstance, resetLayout]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (event.key === "m" && !readOnly) {
          event.preventDefault();
          setSelectedDialog("newModel");
        } else if (event.key === "e" && !readOnly) {
          event.preventDefault();
          setSelectedDialog("newEnum");
        } else if (event.key === "l") {
          event.preventDefault();
          autoLayout();
        } else if (event.key === "d") {
          event.preventDefault();
          download();
        }
      }
    },
    [autoLayout, download, readOnly]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

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
            disabled={readOnly}
          >
            New Model
            <ContextMenuShortcut>⌘M</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem
            inset
            onSelect={() => {
              setSelectedDialog("newEnum");
            }}
            disabled={readOnly}
          >
            New Enum
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem inset onClick={() => autoLayout()}>
            Auto Layout
            <ContextMenuShortcut>⌘L</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => download()}>
            Download
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
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
