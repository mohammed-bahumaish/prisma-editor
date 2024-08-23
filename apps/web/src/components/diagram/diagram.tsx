import { multiplayerState } from "app/multiplayer/multiplayer-state";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ConnectionMode,
  type Edge,
  type Node,
  type NodeChange,
  ReactFlow,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";
import { useSnapshot } from "valtio";
import DiagramContextMenu from "./components/diagram-context-menu";
import relationEdge from "./edges/relationEdge";
import EnumNode from "./nodes/enumNode";
import ModelNode from "./nodes/modelNode";

const nodeTypes = {
  model: ModelNode,
  enum: EnumNode,
};

const edgeTypes = {
  relation: relationEdge,
};

const Diagram = () => {
  const snap = useSnapshot(multiplayerState);
  const sharedNodes = (snap.nodes as Node<any, string | undefined>[]) || []
  const [nodes, setNodes] = useNodesState(sharedNodes);

  const { diagramFocusRef, madeChangesState } = useYDoc();

  // Sync local node state with shared state
  useEffect(() => {
    setNodes(sharedNodes);
  }, [sharedNodes]);

  // Debounced update function for server (nodes only)
  const updateServerNodes = useCallback(
    debounce((newNodes: Node<any, string | undefined>[]) => {
      multiplayerState.nodes = newNodes;
    }, 200),
    []
  );

  // Custom node change handler
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((prevNodes) => {
      const updatedNodes = applyNodeChanges(changes, prevNodes);
      const hasPositionChange = changes.some((change) => 'position' in change);
      if (hasPositionChange) updateServerNodes(updatedNodes);
      return updatedNodes;
    });
  }, [setNodes, updateServerNodes]);

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
                multiplayerState.edges = applyEdgeChanges(change, multiplayerState.edges)
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
            >
              <Background color="grey" />
            </ReactFlow>
          </DiagramContextMenu>
        </div>
        <svg width="0" height="0">
          <defs>
            <marker
              id="relation-one"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-[#5c7194]"
                strokeWidth="3"
                strokeLinecap="square"
                fill="none"
                points="-10,-8 -10,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
            <marker
              id="relation-one-selected"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-black"
                strokeWidth="3"
                strokeLinecap="square"
                fill="none"
                points="-10,-8 -10,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-black"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>

            <marker
              id="relation-many"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
                points="0,-8 -10,0 0,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
            <marker
              id="relation-many-selected"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-black"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
                points="0,-8 -10,0 0,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-black"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>

            <marker
              id="relation-one-dark"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="text-edge stroke-current"
                strokeWidth="3"
                strokeLinecap="square"
                fill="none"
                points="-10,-8 -10,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="text-edge stroke-current"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
            <marker
              id="relation-one-selected-dark"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-white"
                strokeWidth="3"
                strokeLinecap="square"
                fill="none"
                points="-10,-8 -10,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-white"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>

            <marker
              id="relation-many-dark"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
                points="0,-8 -10,0 0,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
            <marker
              id="relation-many-selected-dark"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-white"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
                points="0,-8 -10,0 0,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-white"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Diagram;
