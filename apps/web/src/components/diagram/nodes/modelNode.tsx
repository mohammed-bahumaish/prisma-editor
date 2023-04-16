import clsx from "clsx";
import { memo, useMemo, useState, type FC } from "react";
import { useShallowCompareEffect } from "react-use";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import ModelContextMenu from "../components/model-context-menu";
import ModelFieldContextMenu from "../components/model-field-context-menu";
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

    return (
      <table
        className="border-separate overflow-hidden rounded-lg border-[1px] border-slate-300 bg-white text-sm text-slate-900  shadow-md transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        tabIndex={0}
        style={{ borderSpacing: 0 }}
      >
        <thead className="transition-color cursor-context-menu duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 ">
          <tr>
            <ModelContextMenu model={name}>
              <th className="border-brand-dark flex items-center justify-between gap-4 border-b-[1px] p-2 px-4 text-start font-bold">
                {name}
              </th>
            </ModelContextMenu>
          </tr>
        </thead>
        <tbody className={clsx("table py-2")}>
          {columns.map((col) => (
            <Column col={col} model={name} key={col.name} />
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

    return (
      <tr
        key={col.name}
        className="transition-color relative duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 "
        title={col.documentation}
      >
        <ModelFieldContextMenu key={col.name} field={col} model={model}>
          <div className="absolute inset-0 cursor-context-menu"></div>
        </ModelFieldContextMenu>
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
              isConnectable={false}
            />
          </td>
        ) : (
          <td></td>
        )}

        <td className="px-2">
          <button type="button">
            <span>{col.name}</span>
          </button>
        </td>

        <td className="flex h-full gap-1 pr-2 ">
          <span
            className={clsx([
              { "text-brand-blue ": !isObjectType },
              { "text-brand-teal-1 ": isObjectType },
            ])}
          >
            {col.displayType}
          </span>
          {col.isId && <span className=" text-[#ab351e]">@id</span>}
          <span className="text-[#ab351e]">{col.native || ""}</span>
          <span className="text-[#8cdcfe]">{col.default || ""}</span>
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
