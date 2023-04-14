import { type Edge, type Node } from "reactflow";

export type RelationType = "1-1" | "1-n" | "m-n";

export interface SchemaError {
  reason: string;
  row: string;
}

export interface EnumNodeData {
  type: "enum";
  name: string;
  dbName?: string | null;
  documentation?: string;
  values: string[];
}

export interface ModelNodeData {
  type: "model";
  name: string;
  dbName?: string | null;
  documentation?: string;
  columns: Array<{
    name: string;
    type: string;
    displayType: string;
    kind: string;
    documentation?: string;
    isList: boolean;
    isUpdatedAt: boolean | undefined;
    isId: boolean;
    isReadOnly: boolean;
    hasDefaultValue: boolean;
    isUnique: boolean;
    isRequired: boolean;
    relationName?: string | null;
    relationFromFields?: string[] | null;
    relationToFields?: string[] | null;
    default?: string | null;
    relationType?: RelationType | null;
    native?: string;
  }>;
}

export interface RelationEdgeData {
  relationType: RelationType;
}

export enum ErrorTypes {
  Prisma,
  Other,
}

export interface DMMFToElementsResult {
  nodes: Array<Node<EnumNodeData> | Node<ModelNodeData>>;
  edges: Edge[];
}
