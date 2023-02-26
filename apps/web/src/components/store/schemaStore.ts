import {
  type ConfigMetaFormat,
  type DMMF,
  type SchemaError,
} from "@prisma-editor/prisma-dmmf-extended";
import { type ElkNode } from "elkjs";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from "reactflow";
import { create } from "zustand";
import { apiClient } from "~/utils/api";
import { dmmfToElements } from "../diagram/util/dmmfToFlow";
import { type EnumNodeData, type ModelNodeData } from "../diagram/util/types";
import { getLayout } from "../schemaContext/util/layout";

interface SchemaStore {
  schema: string;
  setSchema: (schema: SchemaStore["schema"]) => Promise<void>;
  setDmmf: (
    dmmf: DMMF.Document["datamodel"],
    config?: ConfigMetaFormat
  ) => Promise<void>;
  dmmf: DMMF.Document["datamodel"] | undefined;
  config: ConfigMetaFormat | undefined;
  nodes: Node<ModelNodeData | EnumNodeData>[];
  edges: Edge<any>[];
  layout: ElkNode | null;
  schemaErrors: SchemaError[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  saveLayout: () => Promise<void>;
}

export const createSchemaStore = create<SchemaStore>((set, state) => ({
  schema: "",
  dmmf: undefined,
  config: undefined,
  nodes: [],
  edges: [],
  layout: null,
  schemaErrors: [],
  setDmmf: async (dmmf, config = state().config) => {
    const schema = await apiClient.dmmf.dmmfToPrismaSchema.mutate({
      dmmf,
      config,
    });
    const { nodes, edges } = dmmfToElements(dmmf, state().layout);
    set((state) => ({ ...state, dmmf, config, schema, nodes, edges }));
  },
  setSchema: async (schema) => {
    const result = await apiClient.dmmf.schemaToDmmf.mutate(schema);
    if (result.datamodel) {
      set((state) => ({
        ...state,
        datamodel: result.datamodel,
        config: result.config,
      }));
    } else if (result.errors) {
      set((state) => ({ ...state, schema, schemaErrors: result.errors }));
    }
  },
  onNodesChange: (nodeChange) => {
    set((state) => ({
      ...state,
      nodes: applyNodeChanges(nodeChange, state.nodes),
    }));
  },
  onEdgesChange: (edgeChange) => {
    set((state) => ({
      ...state,
      edges: applyEdgeChanges(edgeChange, state.edges),
    }));
  },
  saveLayout: async () => {
    const layout = await getLayout(
      state().nodes,
      state().edges,
      state().layout
    );
    set((state) => ({ ...state, layout }));
  },
}));
