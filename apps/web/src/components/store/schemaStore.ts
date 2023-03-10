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
import { persist } from "zustand/middleware";
import { apiClient } from "~/utils/api";
import { dmmfToElements } from "../diagram/util/dmmfToFlow";
import { type EnumNodeData, type ModelNodeData } from "../diagram/util/types";
import { autoLayout, getLayout } from "../schemaContext/util/layout";
// import { type addFieldProps } from "../schemaContext/util/types";
import { defaultSchema } from "../schemaContext/util/util";

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
  saveLayout: (
    nodes: SchemaStore["nodes"],
    edges: SchemaStore["edges"]
  ) => Promise<void>;
  resetLayout: () => Promise<void>;
  // addDmmfField: (model: string, field: addFieldProps) => void;
}

export const createSchemaStore = create<SchemaStore>()(
  persist(
    (set, state) => ({
      schema: defaultSchema,
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
          const { nodes, edges } = dmmfToElements(
            result.datamodel,
            state().layout
          );
          set((state) => ({
            ...state,
            dmmf: result.datamodel,
            config: result.config,
            schemaErrors: [],
            nodes,
            edges,
            schema,
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
      saveLayout: async (nodes, edges) => {
        const layout = await getLayout(nodes, edges, state().layout);
        console.log({ layout });
        set((state) => ({ ...state, layout }));
      },
      resetLayout: async () => {
        console.log("reset");
        const layout = await autoLayout(state().nodes, state().edges);
        const dmmf = state().dmmf;
        const { nodes, edges } =
          typeof dmmf !== "undefined"
            ? dmmfToElements(dmmf, layout)
            : { nodes: [], edges: [] };
        set((state) => ({ ...state, layout, nodes, edges }));
      },
      // addDmmfField: (model, field) => {
      //   const dmmf = { ...state().dmmf };
      //   const modelIndex =
      //     state().dmmf?.models?.findIndex((m) => m.name === model) ?? -1;
      //   if (modelIndex === -1) return;

      //   const fieldIndex = dmmf?.models![modelIndex]?.fields.findIndex(
      //     (f) => f.name === field.name
      //   );
      //   if (fieldIndex !== -1) return;

      //   dmmf!.models[modelIndex]?.fields.push({
      //     name: field.name,
      //     kind: "scalar",
      //     isList: false,
      //     isRequired: true,
      //     isUnique: false,
      //     isId: false,
      //     isReadOnly: false,
      //     hasDefaultValue: false,
      //     type: "String",
      //     isGenerated: false,
      //     isUpdatedAt: false,
      //   });

      //   void state().setDmmf(dmmf);
      // },
    }),
    { name: "store" }
  )
);
