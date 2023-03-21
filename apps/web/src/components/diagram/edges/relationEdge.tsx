import { memo, useCallback } from "react";
import {
  type EdgeProps,
  getSmoothStepPath,
  Position,
  useStore,
} from "reactflow";
import { getEdgeParams } from "../util/util";
import { type RelationEdgeData } from "../util/types";

const RelationEdge = ({
  id,
  source,
  target,
  sourceHandleId,
  targetHandleId,
  style,
  data,
}: EdgeProps<RelationEdgeData>) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  if (!sourceNode || !targetNode || !sourceHandleId || !targetHandleId) {
    return null;
  }
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    sourceHandleId,
    targetNode,
    targetHandleId
  );

  const offset = (x: number, position: Position) => {
    const offsetMargin = 6;
    if (position === Position.Right) return x + offsetMargin;
    else return x - offsetMargin;
  };

  // const [edgePath] = getBezierPath({
  //   sourceX: offset(sx as number, sourcePos as Position) as number,
  //   sourceY: sy as number,
  //   sourcePosition: sourcePos as any,
  //   targetPosition: targetPos as any,
  //   targetX: offset(tx as number, targetPos as Position) as number,
  //   targetY: ty as number,
  //   curvature: 1,
  // });
  const [edgePath] = getSmoothStepPath({
    sourceX: offset(sx, sourcePos),
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: offset(tx, targetPos),
    targetY: ty,
  });

  const relationType = data?.relationType || "1-1";
  const [markerStart, markerEnd] = {
    "m-n": ["url(#relation-many)", "url(#relation-many)"],
    "1-n": ["url(#relation-many)", "url(#relation-one)"],
    "1-1": ["url(#relation-one)", "url(#relation-one)"],
  }[relationType];

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerStart={markerStart}
      markerEnd={markerEnd}
      style={{ ...style, stroke: "#5c7194" }}
    />
  );
};

export default memo(RelationEdge);
