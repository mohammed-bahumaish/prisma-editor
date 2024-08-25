import {
  applyEdgeChanges,
  applyNodeChanges,
  ConnectionMode,
  type Edge,
  type Node,
  type NodeChange,
  ReactFlow,
  useNodesState,
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

  return (
    <div className="h-full w-full">
      <div className="zoompanflow">
        <div className="reactflow-wrapper">
          <DiagramContextMenu>
            <ReactFlow
              nodes={nodes}
              edges={(snap.edges || []) as Edge<any>[]}
              fitView
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionMode={ConnectionMode.Loose}
              minZoom={0.1}
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
