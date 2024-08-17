import { type User } from "@prisma/client";
import { type Edge, type Node } from "reactflow";
import { proxy } from "valtio";
import { type SchemaError } from "~/components/diagram/util/types";

export interface Message {
  text: string;
  sender: Pick<User, "name" | "image" | "id">;
  timestamp: string;
}

export const multiplayerState = proxy({
  nodes: [] as Node<any>[],
  edges: [] as Edge<any>[],
  parseErrors: [] as SchemaError[],
  messages: [] as Message[],
});
