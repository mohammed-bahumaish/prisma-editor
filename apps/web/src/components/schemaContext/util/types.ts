import {
  type DMMF,
  type SchemaError,
} from "@prisma-editor/prisma-dmmf-extended";
import { type ConfigMetaFormat } from "@prisma/internals";
import { type ElkNode } from "elkjs";
import { type Dispatch, type SetStateAction } from "react";
import {
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from "reactflow";
import {
  type EnumNodeData,
  type ModelNodeData,
} from "~/components/diagram/util/types";

export interface SchemaContext {
  schemaState: [string, Dispatch<SetStateAction<string>>];
  dmmfState: [
    DMMF.Document["datamodel"] | undefined,
    Dispatch<SetStateAction<DMMF.Document["datamodel"] | undefined>>
  ];
  configState: [
    ConfigMetaFormat | undefined,
    Dispatch<SetStateAction<ConfigMetaFormat | undefined>>
  ];
  editorConfigState: [
    {
      allowParsing: boolean;
    },
    Dispatch<
      SetStateAction<{
        allowParsing: boolean;
      }>
    >
  ];
  diagramState: {
    nodesState: [
      (Node<EnumNodeData> | Node<ModelNodeData>)[],
      Dispatch<SetStateAction<(Node<EnumNodeData> | Node<ModelNodeData>)[]>>
    ];
    edgesState: [Edge<any>[], Dispatch<SetStateAction<Edge<any>[]>>];
    layoutState: [ElkNode | null, Dispatch<SetStateAction<ElkNode | null>>];
  };
}

export interface useSchemaI {
  dmmf?: DMMF.Document["datamodel"];
  prismaSchema: string;
  setPrismaSchema: (schema: string) => void;
  parse: () => Promise<void>;
  dmmfToSchema: () => Promise<void>;
  nodes: Node<any>[];
  edges: Edge<any>[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  resetLayout: () => Promise<void>;
  setNodes: Dispatch<SetStateAction<Node<any>[]>>;
  schemaErrors: SchemaError[];
  schemaToSql: () => Promise<void>;
  addField: (model: string, field: addFieldProps) => void;
}

export type addFieldProps = {
  name: string;
  type: string;
  defaultValue: string;
  required: boolean;
  unique: boolean;
  updatedAt: boolean;
  list: boolean;
};

export const PARSE_DELAY = 1000;
