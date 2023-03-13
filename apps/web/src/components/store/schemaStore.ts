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
import { autoLayout, getLayout } from "./util/layout";
import { defaultSchema } from "./util/util";

interface SchemaStore {
  openTab: "prisma" | "sql";
  prompt: string;
  schema: string;
  sql: string;
  setSchema: (
    schema: SchemaStore["schema"],
    parseToSql?: boolean
  ) => Promise<void>;
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
  setSql: (sql: string, parseToSchema?: boolean) => Promise<void>;
  setPrompt: (prompt: string) => void;
  setOpenTab: (tab: SchemaStore["openTab"]) => void;
  // addDmmfField: (model: string, field: addFieldProps) => void;
}

export const createSchemaStore = create<SchemaStore>()(
  persist(
    (set, state) => ({
      openTab: "prisma" as SchemaStore["openTab"],
      prompt: `a fictional online bookstore selling books in
various categories. It includes a "books" table, 
a "categories" table, and an "orders" table, along
with auxiliary tables for customers and reviews`,
      schema: defaultSchema,
      sql: "",
      dmmf: undefined as DMMF.Document["datamodel"] | undefined,
      config: undefined as ConfigMetaFormat | undefined,
      nodes: [],
      edges: [],
      layout: null,
      schemaErrors: [],
      setPrompt: (prompt) => {
        set((state) => ({
          ...state,
          prompt,
        }));
      },
      setDmmf: async (dmmf, config = state().config) => {
        const schema = await apiClient.dmmf.dmmfToPrismaSchema.mutate({
          dmmf,
          config,
        });
        const { nodes, edges } = dmmfToElements(dmmf, state().layout);
        set((state) => ({ ...state, dmmf, config, schema, nodes, edges }));
      },
      setSchema: async (schema, parseToSql = true) => {
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
          if (parseToSql) {
            const sql = await apiClient.dmmf.schemaToSql.mutate(state().schema);
            set((state) => ({ ...state, sql }));
          }
        } else if (result.errors && parseToSql) {
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
        set((state) => ({ ...state, layout }));
      },
      setOpenTab: (tab) => {
        set((state) => ({ ...state, openTab: tab }));
      },
      resetLayout: async () => {
        const layout = await autoLayout(state().nodes, state().edges);
        const dmmf = state().dmmf;
        const { nodes, edges } =
          typeof dmmf !== "undefined"
            ? dmmfToElements(dmmf, layout)
            : { nodes: [], edges: [] };
        set((state) => ({ ...state, layout, nodes, edges }));
      },
      setSql: async (sql, parse) => {
        set((state) => ({ ...state, sql }));

        if (parse) {
          try {
            const schema = await apiClient.dmmf.sqlToSchema.mutate(sql);
            await state().setSchema(schema, false);
          } catch {}
        }
      },

      // addDmmfField: (model, field) => {
      // },
    }),

    { name: "store" }
  )
);
