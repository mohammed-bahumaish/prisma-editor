import { multiplayerState } from "app/multiplayer/multiplayer-state";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { useEffect, useMemo } from "react";
import { useDebounce } from "react-use";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSnapshot } from "valtio";
import DiagramContextMenu from "./components/diagram-context-menu";
import relationEdge from "./edges/relationEdge";
import EnumNode from "./nodes/enumNode";
import ModelNode from "./nodes/modelNode";
import { getLayout } from "../store/util/layout";

const nodeTypes = {
  model: ModelNode,
  enum: EnumNode,
};

const edgeTypes = {
  relation: relationEdge,
};

const Diagram = () => {
  const snap = useSnapshot(multiplayerState);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { diagramFocusState, diagramLayoutState, madeChangesState } = useYDoc();

  const nodesPositions = useMemo(
    () => nodes.map((n) => `${n.id}-${n.position.x}-${n.position.y}`).join(""),
    [nodes]
  );
  useDebounce(
    async () => {
      multiplayerState.nodes = nodes;
      multiplayerState.edges = edges;
      diagramLayoutState[1](
        await getLayout(nodes, edges, diagramLayoutState[0] || null)
      );
    },
    10,
    [nodesPositions]
  );

  useEffect(() => {
    if (Array.isArray(snap?.nodes)) {
      setNodes(snap.nodes);
    }
    if (Array.isArray(snap?.edges)) {
      setEdges(snap.edges);
    }
  }, [setEdges, setNodes, snap?.edges, snap?.nodes]);

  return (
    <div className="h-full w-full">
      <div className="zoompanflow">
        <div className="reactflow-wrapper">
          <DiagramContextMenu>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionMode={ConnectionMode.Loose}
              minZoom={0.1}
              onEdgesChange={onEdgesChange}
              onNodesChange={onNodesChange}
              onNodeDragStart={() => {
                madeChangesState[1](true)
                if (diagramFocusState[0] === true) return;
                diagramFocusState[1](true);
              }}
              onNodeDragStop={() => {
                if (diagramFocusState[0] === false) return;
                setTimeout(() => {
                  diagramFocusState[1](false);
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
