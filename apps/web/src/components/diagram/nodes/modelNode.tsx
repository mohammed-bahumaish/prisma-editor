import clsx from "clsx";
import { memo, useMemo } from "react";
import { Handle, Position, useReactFlow, useStoreApi } from "reactflow";
import AddFieldModal from "../components/addFieldModal";
import { type ModelNodeData } from "../util/types";
import { getHandleId } from "../util/util";
import styles from "./styles.module.scss";

type ColumnData = ModelNodeData["columns"][number];

const isTarget = ({
  kind,
  isList,
  relationFromFields,
  relationName,
  relationType,
}: ColumnData) =>
  kind === "enum" ||
  ((relationType === "1-n" || relationType === "m-n") && !isList) ||
  (relationType === "1-1" && !relationFromFields?.length) ||
  // Fallback for implicit m-n tables (maybe they should act like the child in a
  // 1-n instead)
  (kind === "scalar" && !!relationName);

const isSource = ({ isList, relationFromFields, relationType }: ColumnData) =>
  ((relationType === "1-n" || relationType === "m-n") && isList) ||
  (relationType === "1-1" && !!relationFromFields?.length);

const ModelNode = ({ data }: ModelNodeProps) => {
  const AddFieldModalMemoized = useMemo(
    () => (
      <AddFieldModal model={data.name}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </AddFieldModal>
    ),
    [data.name]
  );

  return (
    <table
      className="bg-modal border-brand-dark border-separate rounded-2xl border-[1px] text-sm text-white shadow-md "
      style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}
    >
      <thead title={data.documentation} className="cursor-pointer">
        <tr>
          <th className="border-brand-dark flex items-center justify-between gap-4 border-b-[1px] p-2 px-4 text-start font-bold">
            <span>
              <span>{data.name}</span>
              {!!data.dbName && (
                <span className="font-normal">&nbsp;({data.dbName})</span>
              )}
            </span>
            <span className="flex items-center justify-center gap-2">
              <span> {AddFieldModalMemoized}</span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody className={clsx("table py-2")}>
        <>
          {data.columns.map((col) => (
            <Column col={col} key={col.name} model={data.name} />
          ))}
        </>
      </tbody>
    </table>
  );
};
export interface ModelNodeProps {
  data: ModelNodeData;
}

export default ModelNode;

const Column = memo(
  ({ col, model }: { col: ModelNodeData["columns"][0]; model: string }) => {
    const isObjectType = isTarget(col) || isSource(col);
    const store = useStoreApi();
    const { setCenter, getZoom } = useReactFlow();

    const focusNode = (nodeId: string) => {
      const { nodeInternals } = store.getState();
      const nodes = Array.from(nodeInternals).map(([, node]) => node);
      if (nodes.length > 0) {
        const node = nodes.find((iterNode) => iterNode.id === nodeId);
        if (!node) return;
        const x = node.position.x + node.width! / 2;
        const y = node.position.y + node.height! / 2;
        const zoom = getZoom();
        setCenter(x, y, { zoom, duration: 1000 });
      }
    };

    return (
      <tr key={col.name} className="relative" title={col.documentation}>
        <Handle
          className={clsx([styles.handle, styles.left])}
          type="source"
          id={getHandleId({
            modelName: model,
            fieldName: col.name,
          })}
          position={Position.Left}
          draggable={false}
          isConnectable={false}
        />

        <td className="min-w-[150px] px-2 ">
          <button
            type="button"
            className={clsx(["px-2", { "cursor-pointer": isObjectType }])}
          >
            <AddFieldModal model={model} field={col}>
              <span>{col.name}</span>
            </AddFieldModal>
          </button>
          <button
            type="button"
            className={clsx([
              "text-xs",
              { "text-brand-blue cursor-grab": !isObjectType },
              { "text-brand-teal-1 cursor-pointer": isObjectType },
            ])}
            onClick={() => {
              if (!isObjectType) return;
              focusNode(col.type);
            }}
          >
            {col.displayType}
          </button>
        </td>

        <td className="px-2">
          {col.isId && <span className="px-2 text-xs text-[#ab351e]">@id</span>}
          <span className="px-2 text-xs text-[#8cdcfe]">
            {col.default || ""}
          </span>
        </td>

        <Handle
          className={clsx([styles.handle, styles.right])}
          type="source"
          id={getHandleId({
            modelName: model,
            fieldName: col.name,
          })}
          position={Position.Right}
          isConnectable={false}
        />
      </tr>
    );
  }
);
Column.displayName = "Column";
