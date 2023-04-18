import {
  type ConfigMetaFormat,
  type ConnectorType,
  type DMMF,
  type SchemaError,
} from "@prisma-editor/prisma-dmmf-extended";
import {
  AddEnumCommand,
  AddEnumFieldCommand,
  AddFieldCommand,
  AddModelCommand,
  DMMfModifier,
  RemoveEnumCommand,
  RemoveEnumFieldCommand,
  RemoveFieldCommand,
  RemoveModelCommand,
  UpdateEnumFieldCommand,
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
import { type StoreApi, type UseBoundStore, create } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";
import { api, apiClient } from "~/utils/api";
import { dmmfToElements } from "../diagram/util/dmmfToFlow";
import { type EnumNodeData, type ModelNodeData } from "../diagram/util/types";
import { autoLayout, getLayout } from "./util/layout";
import { defaultSchema, emptySchema } from "./util/util";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

// types from zustand/middleware that are not exported
type Write<T, U> = Omit<T, keyof U> & U;
type PersistListener<S> = (state: S) => void;
type StorePersist<S, Ps> = {
  persist: {
    setOptions: (options: Partial<PersistOptions<S, Ps>>) => void;
    clearStorage: () => void;
    rehydrate: () => Promise<void> | void;
    hasHydrated: () => boolean;
    onHydrate: (fn: PersistListener<S>) => () => void;
    onFinishHydration: (fn: PersistListener<S>) => () => void;
    getOptions: () => Partial<PersistOptions<S, Ps>>;
  };
};
//

type storeType = UseBoundStore<
  Write<StoreApi<SchemaStore>, StorePersist<SchemaStore, SchemaStore>>
>;
class Singleton {
  private static instances: {
    [id: string]: storeType;
  } = {};
  private id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static getInstance(id: string | number): storeType {
    if (typeof Singleton.instances[id] === "undefined") {
      Singleton.instances[id] = createSchema(id);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return Singleton.instances[id]!;
  }

  public getId(): string {
    return this.id;
  }
}

export type addFieldProps = {
  name: string;
  type:
    | "String"
    | "Int"
    | "Boolean"
    | "Float"
    | "DateTime"
    | "Decimal"
    | "BigInt"
    | "Bytes"
    | "JSON";
  isRequired: boolean;
  isUnique: boolean;
  isUpdatedAt?: boolean;
  isList: boolean;
  isId: boolean;
  isManyToManyRelation?: boolean;
  default:
    | number
    | string
    | boolean
    | { name: string; args: string[] }
    | undefined;
  kind: "object" | "enum" | "scalar" | "unsupported";
  native?: string;
};

interface SchemaStore {
  openTab: "prisma" | "sql";
  schema: string;
  sql: string;
  sqlErrorMessage?: string;
  setSchema: (
    schema: SchemaStore["schema"],
    parseToSql?: boolean
  ) => Promise<void>;
  saveSchema: (schema: SchemaStore["schema"]) => Promise<void>;
  restoreSavedSchema: () => Promise<string>;
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
  setOpenTab: (tab: SchemaStore["openTab"]) => void;
  addDmmfField: (model: string, field: addFieldProps) => Promise<void>;
  updateDmmfField: (
    model: string,
    originalFieldName: string,
    field: addFieldProps
  ) => Promise<void>;
  removeDmmfField: (model: string, field: string) => Promise<void>;
  addDmmfModel: (modelName: string, oldModelName?: string) => Promise<void>;
  removeDmmfModel: (modelName: string) => Promise<void>;
  addEnumField: (enumModal: string, field: string) => Promise<void>;
  removeEnumField: (enumModal: string, field: string) => Promise<void>;
  updateEnumField: (
    enumModal: string,
    field: string,
    oldField: string
  ) => Promise<void>;
  addEnum: (enumName: string, oldField?: string) => Promise<void>;
  removeEnum: (enumName: string) => Promise<void>;
  updateLayout: (newLayout: ElkNode | null) => void;
  getConnectorType: () => ConnectorType;
  parseToSql: () => Promise<void>;
}

const createSchema = (schemaId: string | number) =>
  create<SchemaStore>()(
    persist(
      (set, state) => ({
        openTab: "prisma" as SchemaStore["openTab"],
        schema: schemaId === "empty" ? emptySchema : defaultSchema,
        sql: "",
        sqlErrorMessage: undefined as string | undefined,
        dmmf: { enums: [], models: [], types: [] } as DMMF.Datamodel,
        config: undefined as ConfigMetaFormat | undefined,
        nodes: [] as Node<ModelNodeData | EnumNodeData>[],
        edges: [] as Edge<any>[],
        layout: null as ElkNode | null,
        schemaErrors: [] as SchemaError[],

        setDmmf: async (dmmf, config = state().config) => {
          const schema = await apiClient.dmmf.dmmfToPrismaSchema.mutate({
            dmmf,
            config,
          });
          const { nodes, edges } = dmmfToElements(dmmf, state().layout);
          set((state) => ({ ...state, dmmf, config, schema, nodes, edges }));
          await state().saveSchema(schema);
        },
        setSchema: async (schema) => {
          if (schema === state().schema && state().nodes.length > 0) return;
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

            await state().saveSchema(schema);
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

        addDmmfField: async (modelName, field) => {
          const dMMfModifier = new DMMfModifier(state().dmmf);
          const addCommand = new AddFieldCommand(
            modelName,
            {
              name: field.name,
              kind: field.kind,
              relationName:
                field.kind === "object"
                  ? `${field.type}To${modelName}`
                  : undefined,
              isList: field.isList,
              isRequired: field.isRequired,
              isUnique: field.isUnique,
              isId: field.isId,
              isReadOnly: false,
              hasDefaultValue: typeof field.default !== "undefined",
              ...(typeof field.default !== "undefined"
                ? { default: field.default }
                : {}),
              type: field.type,
              isGenerated: false,
              isUpdatedAt: field.isUpdatedAt,
              ...(typeof field.native !== "undefined"
                ? { native: field.native }
                : {}),
            },
            field.isManyToManyRelation
          );
          dMMfModifier.do(addCommand);
          await state().setDmmf(dMMfModifier.get());
        },
        updateDmmfField: async (modelName, originalFieldName, field) => {
          const dMMfModifier = new DMMfModifier(state().dmmf);

          const addCommand = new UpdateFieldCommand(
            modelName,
            originalFieldName,
            {
              name: field.name,
              kind: field.kind,
              relationName:
                field.kind === "object"
                  ? `${field.type}To${modelName}`
                  : undefined,
              isList: field.isList,
              isRequired: field.isRequired,
              isUnique: field.isUnique,
              isId: field.isId,
              hasDefaultValue: typeof field.default !== "undefined",
              default: field.default,
              type: field.type,
              isUpdatedAt: field.isUpdatedAt,
              native: field.native,
            },
            !!field.isManyToManyRelation
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

          let layout = state().layout;
          if (oldModelName && layout?.children) {
            layout = {
              ...layout,
              children: layout.children.map((n) => {
                if (n.id === oldModelName) return { ...n, id: modelName };
                return n;
              }),
            };
            state().updateLayout(layout);
          }

          await state().setDmmf(dMMfModifier.get());
        },
        removeDmmfModel: async (modelName) => {
          const dMMfModifier = new DMMfModifier(state().dmmf);
          const addCommand = new RemoveModelCommand(modelName);
          dMMfModifier.do(addCommand);
          await state().setDmmf(dMMfModifier.get());
        },
        addEnumField: async (enumName, field) => {
          const dMMfModifier = new DMMfModifier(state().dmmf);
          const addCommand = new AddEnumFieldCommand(enumName, field);
          dMMfModifier.do(addCommand);
          await state().setDmmf(dMMfModifier.get());
        },
        removeEnumField: async (enumName, field) => {
          const dMMfModifier = new DMMfModifier(state().dmmf);
          const addCommand = new RemoveEnumFieldCommand(enumName, field);
          dMMfModifier.do(addCommand);
          await state().setDmmf(dMMfModifier.get());
        },
        updateEnumField: async (enumName, field, oldField) => {
          const dMMfModifier = new DMMfModifier(state().dmmf);
          const addCommand = new UpdateEnumFieldCommand(
            enumName,
            field,
            oldField
          );
          dMMfModifier.do(addCommand);
          await state().setDmmf(dMMfModifier.get());
        },
        addEnum: async (enumName, oldEnum) => {
          const dMMfModifier = new DMMfModifier(state().dmmf);
          const addCommand = new AddEnumCommand(enumName, oldEnum);
          dMMfModifier.do(addCommand);

          let layout = state().layout;
          if (oldEnum && layout?.children) {
            layout = {
              ...layout,
              children: layout.children.map((n) => {
                if (n.id === oldEnum) return { ...n, id: enumName };
                return n;
              }),
            };
            state().updateLayout(layout);
          }

          await state().setDmmf(dMMfModifier.get());
        },

        removeEnum: async (enumName) => {
          const dMMfModifier = new DMMfModifier(state().dmmf);
          const addCommand = new RemoveEnumCommand(enumName);
          dMMfModifier.do(addCommand);
          await state().setDmmf(dMMfModifier.get());
        },

        updateLayout: (newLayout) => {
          const { edges, nodes } = dmmfToElements(state().dmmf, newLayout);
          set((state) => ({ ...state, layout: newLayout, edges, nodes }));
        },
        getConnectorType: () => {
          return (
            state().config?.datasources.find((d) => !!d.provider)?.provider ||
            "postgres"
          );
        },
        saveSchema: async (schema) => {
          if (typeof schemaId === "string") return;

          await apiClient.manageSchema.updateSchema.mutate({
            id: schemaId,
            schema,
          });
        },
        restoreSavedSchema: async () => {
          if (typeof schemaId === "string") return state().schema;
          const schema = await apiClient.manageSchema.getSchema.query({
            id: schemaId,
          });
          const newSchema = schema || state().schema || defaultSchema;
          await state().setSchema(newSchema);
          return newSchema;
        },
        parseToSql: async () => {
          const sql = await apiClient.dmmf.schemaToSql.mutate(state().schema);
          set((state) => ({ ...state, sql }));
        },
      }),
      { name: `${schemaId}` }
    )
  );

export const useSchemaStore = () => {
  const { query } = useRouter();

  const schemaId =
    typeof query.id === "undefined"
      ? "empty"
      : isNaN(Number(query.id as string))
      ? "store"
      : +(query.id as string);

  const store = Singleton.getInstance(schemaId);

  return store;
};
