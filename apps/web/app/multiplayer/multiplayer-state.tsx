import { type Edge, type Node } from "reactflow";
import { proxy } from "valtio";
import { type SchemaError } from "~/components/diagram/util/types";

export const multiplayerState = proxy({
  nodes: [] as Node<any>[],
  edges: [] as Edge<any>[],
  parseErrors: [] as SchemaError[],
});

