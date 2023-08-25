import { memo, useCallback } from "react";
import { Position, getBezierPath, useStore, type EdgeProps } from "reactflow";
import { type RelationEdgeData } from "../util/types";
import { getEdgeParams } from "../util/util";
import clsx from "clsx";
import { useTheme } from "next-themes";

const RelationEdge = ({
  id,
  source,
  target,
  sourceHandleId,
  targetHandleId,
  style,
  data,
  selected,
}: EdgeProps<RelationEdgeData>) => {
  const { resolvedTheme } = useTheme();

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

  const [edgePath] = getBezierPath({
    sourceX: offset(sx, sourcePos),
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: offset(tx, targetPos),
    targetY: ty,
    curvature: 0.5,
  });
  // const [edgePath] = getSmoothStepPath({
  //   sourceX: offset(sx, sourcePos),
  //   sourceY: sy,
  //   sourcePosition: sourcePos,
  //   targetPosition: targetPos,
  //   targetX: offset(tx, targetPos),
  //   targetY: ty,
  // });

  const isSelected = selected || sourceNode?.selected || targetNode.selected;
  const relationType = data?.relationType || "1-1";
  const [markerStart, markerEnd] = {
    "m-n": [
      `url(#relation-many${isSelected ? "-selected" : ""}${
        resolvedTheme === "dark" ? "-dark" : ""
      })`,
      `url(#relation-many${isSelected ? "-selected" : ""}${
        resolvedTheme === "dark" ? "-dark" : ""
      })`,
    ],
    "1-n": [
      `url(#relation-one${isSelected ? "-selected" : ""}${
        resolvedTheme === "dark" ? "-dark" : ""
      })`,
      `url(#relation-many${isSelected ? "-selected" : ""}${
        resolvedTheme === "dark" ? "-dark" : ""
      })`,
    ],
    "1-1": [
      `url(#relation-one${isSelected ? "-selected" : ""}${
        resolvedTheme === "dark" ? "-dark" : ""
      })`,
      `url(#relation-one${isSelected ? "-selected" : ""}${
        resolvedTheme === "dark" ? "-dark" : ""
      })`,
    ],
  }[relationType];

  const darkColorEdge = isSelected ? "#fff" : "#5c7194";
  const lightColorEdge = isSelected ? "#000" : "#5c7194";
  const edgeColor = resolvedTheme === "dark" ? darkColorEdge : lightColorEdge;

  return (
    <path
      id={id}
      className={clsx("react-flow__edge-path  ")}
      d={edgePath}
      markerStart={markerStart}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: edgeColor,
      }}
    />
  );
};

export default memo(RelationEdge);
