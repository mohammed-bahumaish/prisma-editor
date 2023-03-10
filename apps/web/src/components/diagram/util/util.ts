/* eslint-disable @typescript-eslint/no-explicit-any */
import { type DMMF } from "@prisma-editor/prisma-dmmf-extended";
import { type Edge, MarkerType, type Node } from "reactflow";

export const dmmfToFlow = (dmmf: DMMF.Datamodel | undefined) => {
  const nodes: Node<any>[] = [];
  const edges: Edge<any>[] = [];
  if (!dmmf) return { nodes, edges };

  let xPosition = 0;
  let yPosition = 0;

  dmmf.models.forEach((m) => {
    const fields = m.fields.map((f) => {
      if (f.kind === "object") {
        const sourceModel = m.name;
        const sourceField = getHandleId({
          fieldName: f.name,
          modelName: m.name,
        });
        const destinationModel = f.type;
        const destinationField = getHandleId({
          modelName: f.type,
          fieldName: "id",
        });
        edges.push({
          id: sourceField,
          source: sourceModel,
          target: destinationModel,
          type: "floating",
          sourceHandle: sourceField,
          targetHandle: destinationField,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });
      }
      return { name: f.name };
    }); // list of it's fields

    // add model
    nodes.push({
      id: m.name,
      type: "erNode",
      data: fields,
      position: { x: xPosition * 3, y: yPosition * 3 },
    });

    // adjust position for the next model
    xPosition += 100;
    if (xPosition % 2) {
      yPosition += 100;
    }
  });
  return { nodes, edges };
};

export const getHandleId = ({
  modelName,
  fieldName,
}: {
  modelName: string;
  fieldName: string;
}) => {
  return `${modelName}_${fieldName}`;
};

import { Position, internalsSymbol } from "reactflow";

function getParams(
  nodeA: Node,
  handleA: string,
  nodeB: Node
): [number, number, Position] {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  let position;

  if (nodeA.type === "enum")
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  else position = centerA.x > centerB.x ? Position.Left : Position.Right;

  const [x, y] = getHandleCoordsByPosition(nodeA, handleA, position);
  return [x, y, position];
}

function getHandleCoordsByPosition(
  node: Node,
  handleId: string,
  handlePosition: Position
): [number, number] {
  // all handles are from type source, that's why we use handleBounds.source here
  const handle = node[internalsSymbol]?.handleBounds?.source?.find(
    (h) => h.position === handlePosition && h.id === handleId
  );

  if (!handle || !node.positionAbsolute) return [0, 0];
  let offsetX = handle.width / 2;
  const offsetY = handle.height / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
  }

  const x = node.positionAbsolute.x + handle.x + offsetX;
  const y = node.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
}

function getNodeCenter(node: Node) {
  if (!node.positionAbsolute || !node.width || !node.height)
    return { x: 0, y: 0 };

  return {
    x: node.positionAbsolute.x + node.width / 2,
    y: node.positionAbsolute.y + node.height / 2,
  };
}

export function getEdgeParams(
  source: Node,
  sourceHandleId: string,
  target: Node,
  targetHandleId: string
) {
  const [sx, sy, sourcePos] = getParams(source, sourceHandleId, target);
  const [tx, ty, targetPos] = getParams(target, targetHandleId, source);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}
