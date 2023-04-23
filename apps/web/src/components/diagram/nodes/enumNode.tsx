import clsx from "clsx";
import { Handle, Position } from "reactflow";
import { cn } from "~/components/ui/lib/cn";
import EnumContextMenu from "../components/enum-context-menu";
import EnumFieldContextMenu from "../components/enum-field-context-menu";
import { type EnumNodeData } from "../util/types";
import styles from "./styles.module.scss";

const EnumNode = ({ data }: EnumNodeProps) => {
  return (
    <div
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
      <EnumContextMenu model={data.name}>
        <p className="border-brand-indigo-2 flex cursor-context-menu items-center justify-between border-b-[1px] p-2 pl-4 text-start font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
          <span>{data.name}</span>
        </p>
      </EnumContextMenu>
      <div className="flex min-h-[40px] flex-col overflow-hidden py-2">
        {data.values.map((val) => (
          <EnumFieldContextMenu field={val} model={data.name} key={val}>
            <p
              className={cn(
                styles.row,
                "relative px-4 hover:bg-slate-100 dark:hover:bg-slate-800 "
              )}
            >
              {val}
            </p>
          </EnumFieldContextMenu>
        ))}
      </div>
      <Handle
        className={clsx([styles.handle, styles.right])}
        type="source"
        id={data.name + "-handle"}
        position={Position.Right}
        isConnectable={false}
      />
    </div>
  );
};

export interface EnumNodeProps {
  data: EnumNodeData;
}

export default EnumNode;
