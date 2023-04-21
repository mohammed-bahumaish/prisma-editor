import clsx from "clsx";
import { Handle, Position } from "reactflow";
import { cn } from "~/components/ui/lib/cn";
import EnumContextMenu from "../components/enum-context-menu";
import EnumFieldContextMenu from "../components/enum-field-context-menu";
import { type EnumNodeData } from "../util/types";
import styles from "./styles.module.scss";

const EnumNode = ({ data }: EnumNodeProps) => {
  return (
    <table
      className="border-separate overflow-hidden rounded-lg border-[1px] border-slate-300 bg-white text-sm text-slate-900 shadow-md   dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}
      tabIndex={0}
    >
      <Handle
        className={clsx([styles.handle, styles.left])}
        type="source"
        id={data.name + "-handle"}
        position={Position.Left}
        isConnectable={false}
      />
      <thead
        title={data.documentation}
        className="transition-color  hover:bg-slate-100 dark:hover:bg-slate-800 "
      >
        <tr>
          <EnumContextMenu model={data.name}>
            <th className="border-brand-indigo-2 flex cursor-context-menu items-center justify-between border-b-[1px] p-2 pl-4 text-start font-bold">
              <span>
                <span>{data.name}</span>
                {!!data.dbName && (
                  <span className="font-normal">&nbsp;({data.dbName})</span>
                )}
              </span>
            </th>
          </EnumContextMenu>
        </tr>
      </thead>
      <tbody className="flex min-h-[40px] flex-col overflow-hidden py-2">
        {data.values.map((val) => (
          <tr
            key={val}
            className={cn(
              styles.row,
              "transition-color relative  hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <EnumFieldContextMenu field={val} model={data.name}>
              <div className="absolute inset-0 cursor-context-menu"></div>
            </EnumFieldContextMenu>
            <td className=" flex px-4 ">{val}</td>
          </tr>
        ))}
      </tbody>
      <Handle
        className={clsx([styles.handle, styles.right])}
        type="source"
        id={data.name + "-handle"}
        position={Position.Right}
        isConnectable={false}
      />
    </table>
  );
};

export interface EnumNodeProps {
  data: EnumNodeData;
}

export default EnumNode;
