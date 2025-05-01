/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { type Edge, type Node } from "@xyflow/react";
import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.spacing.nodeNode": "75",
    "elk.layered.spacing.nodeNodeBetweenLayers": "75",
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
    "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
  },
});

const FIELD_HEIGHT = 30;
const CHAR_WIDTH = 10;
const MARGIN = 300;

const normalizeSize = (value: number) => Math.max(value, MARGIN);

const calculateHeight = (node: Node) => {
  if (node.data.type === "enum" && Array.isArray(node.data.values)) {
    const fieldsHeight = node.data.values.length * FIELD_HEIGHT;
    const height = fieldsHeight + FIELD_HEIGHT;

    return normalizeSize(height);
  }

  if (Array.isArray(node.data.columns)) {
    const fieldsHeight = node.data.columns.length * FIELD_HEIGHT;
    const heightWithTitle = fieldsHeight + FIELD_HEIGHT;

    return normalizeSize(heightWithTitle);
  }

  return MARGIN; // Default size if columns is not an array
};

const calculateWidth = (node: Node) => {
  if (node.data.type === "enum" && Array.isArray(node.data.values)) {
    const width =
      (node.data.values as string[]).reduce(
        (acc: number, curr: string) =>
          Math.max(acc, typeof curr === "string" ? curr.length : 0),
        (node.data.name && typeof node.data.name === "string"
          ? node.data.name.length
          : 0) +
          (node.data.dbName && typeof node.data.dbName === "string"
            ? node.data.dbName.length
            : 0)
      ) *
        CHAR_WIDTH +
      100;

    return normalizeSize(width);
  }

  const headerLength =
    (typeof node.data.name === "string" ? node.data.name.length : 0) +
    (typeof node.data.dbName === "string" ? node.data.dbName.length : 0);

  const [nameLength, typeLength, defaultValueLength] = (
    node.data.columns as Array<{ name: string; type: string; default?: string }>
  ).reduce(
    (acc, curr) => {
      const currDefaultValueLength = curr.default?.length || 0;

      return [
        acc[0] < curr.name.length ? curr.name.length : acc[0],
        acc[1] < curr.type.length ? curr.type.length : acc[1],
        acc[2] < currDefaultValueLength ? currDefaultValueLength : acc[2],
      ];
    },
    [0, 0, 0]
  );

  const columnsLength = nameLength + typeLength + defaultValueLength;

  const width =
    headerLength > columnsLength
      ? headerLength * CHAR_WIDTH
      : columnsLength * CHAR_WIDTH;

  return normalizeSize(width);
};

export const autoLayout = async (
  nodes: Node<Record<string, unknown>>[],
  edges: Edge[]
) => {
  const elkNodes: ElkNode[] = [];
  const elkEdges: ElkExtendedEdge[] = [];

  nodes.forEach((node) => {
    elkNodes.push({
      id: node.id,
      width: calculateWidth(node),
      height: calculateHeight(node),
    });
  });

  edges.forEach((edge) => {
    elkEdges.push({
      id: edge.id,
      targets: [edge.target],
      sources: [edge.source],
    });
  });

  const layout = await elk.layout({
    id: "root",
    children: elkNodes,
    edges: elkEdges,
  });

  return layout;
};

export const getLayout = (nodes: Node[]) => {
  const positions: { [key: string]: { x: number; y: number } } = nodes.reduce(
    (p, c) => {
      return {
        ...p,
        [c.id]: {
          x: c.position.x,
          y: c.position.y,
        },
      };
    },
    {}
  );

  const newLayout = {
    children: nodes.map((n) => ({
      id: n.id,
      width: calculateWidth(n),
      height: calculateHeight(n),
      ...positions[n.id],
    })),
  } as ElkNode;

  return newLayout;
};
