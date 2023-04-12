import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge, type Node } from "reactflow";

import {
  type EnumNodeData,
  type ModelNodeData,
} from "../../diagram/util/types";

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.spacing.nodeNode": "75",
    "elk.layered.spacing.nodeNodeBetweenLayers": "75",
  },
});

const FIELD_HEIGHT = 30;
const CHAR_WIDTH = 10;
const MARGIN = 300;

const normalizeSize = (value: number) => Math.max(value, MARGIN);

const calculateHeight = (node: Node<EnumNodeData | ModelNodeData>) => {
  if (node.data.type === "enum") {
    const fieldsHeight = node.data.values.length * FIELD_HEIGHT;
    const height = fieldsHeight + FIELD_HEIGHT;

    return normalizeSize(height);
  }

  const fieldsHeight = node.data.columns.length * FIELD_HEIGHT;
  const heightWithTitle = fieldsHeight + FIELD_HEIGHT;

  return normalizeSize(heightWithTitle);
};

const calculateWidth = (node: Node<EnumNodeData | ModelNodeData>) => {
  if (node.data.type === "enum") {
    const width =
      node.data.values.reduce(
        (acc, curr) => (acc < curr.length ? curr.length : acc),
        node.data.name.length + (node.data.dbName?.length || 0)
      ) *
        CHAR_WIDTH +
      100;

    return normalizeSize(width);
  }

  const headerLength = node.data.name.length + (node.data.dbName?.length || 0);

  const [nameLength, typeLength, defaultValueLength] = node.data.columns.reduce(
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
  nodes: Node<EnumNodeData | ModelNodeData>[],
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

export const getLayout = async (
  nodes: Node<ModelNodeData | EnumNodeData>[],
  edges: Edge[],
  layout: ElkNode | null
) => {
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

  let currentLayout = layout;
  if ((layout?.children?.length || 0) < Object.keys(positions).length) {
    currentLayout = await autoLayout(nodes, edges);
  }

  const newLayout = {
    ...currentLayout,
    children: currentLayout?.children?.map((e) => ({
      ...e,
      ...positions[e.id],
    })),
  } as ElkNode;

  return newLayout;
};
