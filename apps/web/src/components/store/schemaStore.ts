import {
  type ConfigMetaFormat,
  type DMMF,
  type SchemaError,
} from "@prisma-editor/prisma-dmmf-extended";
import {
  AddFieldCommand,
  AddModelCommand,
  DMMfModifier,
  RemoveFieldCommand,
  UpdateFieldCommand,
} from "@prisma-editor/prisma-dmmf-modifier";
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

export type addFieldProps = {
  name: string;
  type: string;
  // defaultValue: string;
  isRequired: boolean;
  isUnique: boolean;
  updatedAt: boolean;
  isList: boolean;
  isId: boolean;
  isManyToManyRelation?: boolean;
};

interface SchemaStore {
  openTab: "prisma" | "sql";
  prompt: string;
  schema: string;
  sql: string;
  sqlErrorMessage?: string;
  setSchema: (
    schema: SchemaStore["schema"],
    parseToSql?: boolean
  ) => Promise<void>;
  setDmmf: (
    dmmf: DMMF.Document["datamodel"],
    config?: ConfigMetaFormat
  ) => Promise<void>;
  dmmf: DMMF.Document["datamodel"];
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
  addDmmfField: (model: string, field: addFieldProps) => Promise<void>;
  updateDmmfField: (
    model: string,
    originalFieldName: string,
    field: addFieldProps
  ) => Promise<void>;
  removeDmmfField: (model: string, field: string) => Promise<void>;
  addDmmfModel: (modelName: string, oldModelName?: string) => Promise<void>;
}

export const createSchemaStore = create<SchemaStore>()(
  persist(
    (set, state) => ({
      openTab: "prisma" as SchemaStore["openTab"],
      prompt: `online store, orders table, product table, users table, relations between tables`,
      schema: defaultSchema,
      sql: "",
      sqlErrorMessage: undefined,
      dmmf: { enums: [], models: [], types: [] },
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
            const result = await apiClient.dmmf.sqlToSchema.mutate(sql);

            if (result.dmmf?.datamodel) {
              const { nodes, edges } = dmmfToElements(
                result.dmmf.datamodel,
                state().layout
              );
              set((state) => ({
                ...state,
                dmmf: result.dmmf.datamodel,
                config: result.dmmf.config,
                schema: result.schema,
                nodes,
                edges,
                schemaErrors: [],
                sqlErrorMessage: undefined,
              }));
            } else if (result.error) {
              set((state) => ({
                ...state,
                sqlErrorMessage: result.error,
              }));
            }
          } catch {}
        }
      },

      addDmmfField: async (modelName, field) => {
        const dMMfModifier = new DMMfModifier(state().dmmf);

        const modelNames = dMMfModifier.getModelsNames();
        const isRelation = modelNames.includes(field.type);

        const addCommand = new AddFieldCommand(
          modelName,
          {
            name: field.name,
            kind: isRelation ? "object" : "scalar",
            relationName: isRelation
              ? `${field.type}To${modelName}`
              : undefined,
            isList: field.isList,
            isRequired: field.isRequired,
            isUnique: field.isUnique,
            isId: field.isId,
            isReadOnly: false,
            hasDefaultValue: false,
            type: field.type,
            isGenerated: false,
            isUpdatedAt: false,
          },
          field.isManyToManyRelation
        );
        dMMfModifier.do(addCommand);
        await state().setDmmf(dMMfModifier.get());
      },
      updateDmmfField: async (modelName, originalFieldName, field) => {
        const dMMfModifier = new DMMfModifier(state().dmmf);

        const modelNames = dMMfModifier.getModelsNames();
        const isRelation = modelNames.includes(field.type);

        const addCommand = new UpdateFieldCommand(
          modelName,
          originalFieldName,
          {
            name: field.name,
            kind: isRelation ? "object" : "scalar",
            relationName: isRelation
              ? `${field.type}To${modelName}`
              : undefined,
            isList: field.isList,
            isRequired: field.isRequired,
            isUnique: field.isUnique,
            isId: field.isId,
            isReadOnly: false,
            hasDefaultValue: false,
            type: field.type,
            isGenerated: false,
            isUpdatedAt: false,
          }
        );
        dMMfModifier.do(addCommand);
        await state().setDmmf(dMMfModifier.get());
      },
      removeDmmfField: async (modelName, field) => {
        const dMMfModifier = new DMMfModifier(state().dmmf);
        const addCommand = new RemoveFieldCommand(modelName, field);
        dMMfModifier.do(addCommand);
        await state().setDmmf(dMMfModifier.get());
      },
      addDmmfModel: async (modelName, oldModelName) => {
        const dMMfModifier = new DMMfModifier(state().dmmf);
        const addCommand = new AddModelCommand(modelName, oldModelName);
        dMMfModifier.do(addCommand);
        await state().setDmmf(dMMfModifier.get());
      },
    }),
    { name: "store" }
  )
);
