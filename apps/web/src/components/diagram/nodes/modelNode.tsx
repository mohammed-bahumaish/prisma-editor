import clsx from "clsx";
import { type FC, useCallback, useMemo, useState, memo } from "react";
import { useShallowCompareEffect } from "react-use";
import {
  Handle,
  Position,
  useReactFlow,
  useStoreApi,
  useUpdateNodeInternals,
} from "reactflow";
import AddFieldModal from "../components/addFieldModal";
import AddModelModal from "../components/addModelModal";
import { type ModelNodeData } from "../util/types";
import { getHandleId } from "../util/util";
import styles from "./styles.module.scss";

const ModelNode = ({ data }: ModelNodeProps) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [isFirstRender, setIsFirstRender] = useState(true);

  const objectCols = useMemo(() => {
    const val: { [key: string]: string } = {};

    data.columns.forEach((c) => {
      if (c.kind === "object") {
        val[c.name] = c.name;
      }
    });
    return val;
  }, [data.columns]);

  useShallowCompareEffect(() => {
    if (isFirstRender && Object.keys(objectCols).length > 0) {
      setIsFirstRender(false);
      return;
    }
    updateNodeInternals(data.name);
  }, [objectCols]);

  const columns = useMemo(() => data.columns, [data.columns]);

  return <Model name={data.name} columns={columns} />;
};

const Model: FC<{ name: string; columns: ModelNodeData["columns"] }> = memo(
  ({ name, columns }) => {
    const updateNodeInternals = useUpdateNodeInternals();
    const [isFirstRender, setIsFirstRender] = useState(true);

    const objectCols = useMemo(() => {
      const val: { [key: string]: string } = {};

      columns.forEach((c) => {
        if (c.kind === "object") {
          val[c.name] = c.name;
        }
      });
      return val;
    }, [columns]);

    useShallowCompareEffect(() => {
      if (isFirstRender && Object.keys(objectCols).length > 0) {
        setIsFirstRender(false);
        return;
      }
      updateNodeInternals(name);
    }, [objectCols]);

    const AddFieldModalMemoized = useMemo(
      () => (
        <AddFieldModal model={name}>
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
      [name]
    );

    return (
      <table
        className="bg-modal border-brand-dark border-separate rounded-2xl border-[1px] text-sm text-white shadow-md "
        style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}
      >
        <thead className="cursor-pointer">
          <tr>
            <th className="border-brand-dark flex items-center justify-between gap-4 border-b-[1px] p-2 px-4 text-start font-bold">
              <AddModelModal modelName={name}>
                <button>
                  <span>{name}</span>
                </button>
              </AddModelModal>
              <span className="flex items-center justify-center gap-2">
                <span> {AddFieldModalMemoized}</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody className={clsx("table py-2")}>
          {columns.map((col) => (
            <Column col={col} key={col.name} model={name} />
          ))}
        </tbody>
      </table>
    );
  }
);
Model.displayName = "Model";
export interface ModelNodeProps {
  data: ModelNodeData;
}

export default ModelNode;

const Column = memo(
  ({ col, model }: { col: ModelNodeData["columns"][0]; model: string }) => {
    const isObjectType = useMemo(
      () => ["object", "enum"].includes(col.kind),
      [col.kind]
    );
    const store = useStoreApi();
    const { setCenter, getZoom } = useReactFlow();

    const focusNode = useCallback(
      (nodeId: string) => {
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
      },
      [getZoom, setCenter, store]
    );

    return (
      <tr key={col.name} className="relative" title={col.documentation}>
        {isObjectType ? (
          <td>
            <Handle
              className={clsx([styles.handle, styles.left])}
              type="source"
              id={getHandleId({
                modelName: model,
                fieldName: col.name,
              })}
              position={Position.Left}
              draggable={false}
            />
          </td>
        ) : (
          <td></td>
        )}

        <td className="px-2 ">
          <button
            type="button"
            className={clsx(["px-2", { "cursor-pointer": isObjectType }])}
          >
            <AddFieldModal model={model} field={col}>
              <span>{col.name}</span>
            </AddFieldModal>
          </button>
        </td>

        <td>
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
          {col.isId && <span className="pr-2 text-xs text-[#ab351e]">@id</span>}
          <span className="text-xs text-[#8cdcfe]">{col.default || ""}</span>
        </td>

        {isObjectType ? (
          <td>
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
          </td>
        ) : (
          <td></td>
        )}
      </tr>
    );
  }
);

Column.displayName = "Column";
