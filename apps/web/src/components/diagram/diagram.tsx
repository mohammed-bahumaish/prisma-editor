import {
  applyEdgeChanges,
  applyNodeChanges,
  ConnectionMode,
  type Edge,
  type Node,
  type NodeChange,
  ReactFlow,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { multiplayerState } from "app/multiplayer/multiplayer-state";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import { useSnapshot } from "valtio";
import DiagramContextMenu from "./components/diagram-context-menu";
import relationEdge from "./edges/relationEdge";
import EnumNode from "./nodes/enumNode";
import ModelNode from "./nodes/modelNode";
import { RelationSVGs } from "./relations-svgs";

const nodeTypes = {
  model: ModelNode,
  enum: EnumNode,
};

const edgeTypes = {
  relation: relationEdge,
};

const Diagram = () => {
  const snap = useSnapshot(multiplayerState);
  const sharedNodes = (snap.nodes as Node[]) || [];
  const [nodes, setNodes] = useNodesState(sharedNodes);

  const { diagramFocusRef, madeChangesState } = useYDoc();

  // Sync local node state with shared state
  useEffect(() => {
    setNodes(sharedNodes);
  }, [sharedNodes]);

  // Debounced update function for server (nodes only)
  const updateServerNodes = useCallback(
    debounce((newNodes: Node[]) => {
      multiplayerState.nodes = newNodes;
    }, 200),
    []
  );

  // Custom node change handler
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((prevNodes) => {
        const updatedNodes = applyNodeChanges(changes, prevNodes);
        const hasPositionChange = changes.some(
          (change) => "position" in change
        );
        if (hasPositionChange) updateServerNodes(updatedNodes);
        return updatedNodes;
      });
    },
    [setNodes, updateServerNodes]
  );

  const { screenToFlowPosition } = useReactFlow();

  return (
    <div className="h-full w-full">
      <div className="zoompanflow">
        <div className="reactflow-wrapper !cursor-pointer">
          <DiagramContextMenu>
            <ReactFlow
              nodes={nodes}
              edges={(snap.edges || []) as Edge<any>[]}
              fitView
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionMode={ConnectionMode.Loose}
              minZoom={0.1}
              onClick={(event) => {
                const targetIsPane =
                  event.target instanceof Element &&
                  event.target.classList.contains("react-flow__pane");
                // add cursor: default; to react-flow__pane
                const element = event.target as HTMLElement;
                element.style.cursor = "crosshair";

                if (targetIsPane) {
                  // we need to remove the wrapper bounds, in order to get the correct position
                  const id = "any";
                  const newNode = {
                    id,
                    position: screenToFlowPosition({
                      x: event.clientX,
                      y: event.clientY,
                    }),
                    data: {
                      label: `Node ${id}`,
                      type: "model",
                      name: "model",
                      dbName: "hey",
                      columns: [],
                    },
                    type: "model",
                    origin: [0.5, 0.0] as [number, number],
                  } as Node;

                  setNodes((nds) => nds.concat(newNode));
                }
              }}
              onEdgesChange={(change) => {
                multiplayerState.edges = applyEdgeChanges(
                  change,
                  multiplayerState.edges
                );
              }}
              onNodesChange={handleNodesChange}
              onNodeDragStart={() => {
                madeChangesState[1](true);
                if (diagramFocusRef.current === true) return;
                diagramFocusRef.current = true;
              }}
              onNodeDragStop={() => {
                if (diagramFocusRef.current === false) return;
                setTimeout(() => {
                  diagramFocusRef.current = false;
                }, 2000);
              }}
            ></ReactFlow>
          </DiagramContextMenu>
        </div>
        <RelationSVGs />
      </div>
    </div>
  );
};

export default Diagram;
