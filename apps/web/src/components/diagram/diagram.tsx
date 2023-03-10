import { useDebounce } from "react-use";
import { ConnectionMode, ControlButton, Controls, ReactFlow } from "reactflow";
import { createSchemaStore } from "../store/schemaStore";
import relationEdge from "./edges/relationEdge";
import EnumNode from "./nodes/enumNode";
import ModelNode from "./nodes/modelNode";
import "reactflow/dist/style.css";

const nodeTypes = {
  model: ModelNode,
  enum: EnumNode,
};

const edgeTypes = {
  relation: relationEdge,
};

const Diagram = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    resetLayout,
    saveLayout,
  } = createSchemaStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    resetLayout: state.resetLayout,
    saveLayout: state.saveLayout,
  }));

  useDebounce(
    () => {
      void saveLayout(nodes, edges);
    },
    1000,
    [nodes, edges]
  );

  return (
    <div className="h-full w-full">
      <div className="zoompanflow">
        <div className="reactflow-wrapper">
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
          >
            <Controls>
              <ControlButton
                title="Reset Layout"
                onClick={() => {
                  void resetLayout();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </ControlButton>
            </Controls>
          </ReactFlow>
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
              id="relation-many"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="text-edge stroke-current"
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
                className="text-edge stroke-current"
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
