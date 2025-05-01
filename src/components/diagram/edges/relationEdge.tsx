import {
  Position,
  getSmoothStepPath,
  useInternalNode,
  type EdgeProps,
} from "@xyflow/react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { memo } from "react";
import { getEdgeParams } from "../util/util";

const RelationEdge = ({
  id,
  source,
  target,
  sourceHandleId,
  targetHandleId,
  style,
  data,
  selected,
}: EdgeProps) => {
  const { resolvedTheme } = useTheme();
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

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

  const [edgePath] = getSmoothStepPath({
    sourceX: offset(sx, sourcePos),
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: offset(tx, targetPos),
    targetY: ty,
    borderRadius: 50,
  });

  const isSelected = selected || sourceNode?.selected || targetNode.selected;
  const relationType = data?.relationType || "1-1";

  type RelationType = "m-n" | "1-n" | "1-1";
  type MarkerUrlPair = [string, string];

  const markerUrls: Record<RelationType, MarkerUrlPair> = {
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
  };

  const [markerStart, markerEnd] = markerUrls[relationType as RelationType];

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
