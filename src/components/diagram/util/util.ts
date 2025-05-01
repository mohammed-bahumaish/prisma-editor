/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { type InternalNode, Position } from "@xyflow/react";

export const getHandleId = ({
  modelName,
  fieldName,
}: {
  modelName: string;
  fieldName: string;
}) => {
  return `${modelName}_${fieldName}`;
};

function getParams(
  nodeA: InternalNode,
  handleA: string,
  nodeB: InternalNode
): [number, number, Position] {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const position =
    centerA.x + (nodeA.measured.width || 200) > centerB.x
      ? Position.Left
      : Position.Right;

  const [x, y] = getHandleCoordsByPosition(nodeA, handleA, position);
  return [x, y, position];
}

const OFFSET = 7;
function getHandleCoordsByPosition(
  node: InternalNode,
  handleId: string,
  handlePosition: Position
): [number, number] {
  // all handles are from type source, that's why we use handleBounds.source here

  const handle = node.internals.handleBounds?.source?.find(
    (h) => h.position === handlePosition && h.id === handleId
  );

  if (!handle || !node.internals.positionAbsolute) return [0, 0];
  let offsetX = handle.width / 2;
  const offsetY = handle.height / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = OFFSET;
      break;
    case Position.Right:
      offsetX = handle.width - OFFSET;
      break;
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX;
  const y = node.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
}

function getNodeCenter(node: InternalNode) {
  if (
    !node.internals.positionAbsolute ||
    !node.measured.width ||
    !node.measured.height
  )
    return { x: 0, y: 0 };

  return {
    x: node.internals.positionAbsolute.x + node.measured.width / 2,
    y: node.internals.positionAbsolute.y + node.measured.height / 2,
  };
}

export function getEdgeParams(
  source: InternalNode,
  sourceHandleId: string,
  target: InternalNode,
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
