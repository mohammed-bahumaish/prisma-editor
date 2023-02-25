import { useState } from "react";
import { Handle, Position } from "reactflow";
import styles from "./styles.module.scss";
import { type EnumNodeData } from "../util/types";
import clsx from "clsx";

const EnumNode = ({ data }: EnumNodeProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <table
      className=" bg-modal border-brand-indigo-2 border-separate rounded-2xl border-[1px] text-sm text-white shadow-md"
      style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}
    >
      <Handle
        className={clsx([styles.handle, styles.top])}
        type="source"
        id={data.name + "-handle"}
        position={Position.Top}
        isConnectable={false}
      />
      <thead title={data.documentation} className="cursor-pointer">
        <tr>
          <th className="border-brand-indigo-2 flex items-center justify-between border-b-[1px] p-2 pl-4 text-start font-bold">
            <span>
              <span>{data.name}</span>
              {!!data.dbName && (
                <span className="font-normal">&nbsp;({data.dbName})</span>
              )}
            </span>
            <button onClick={() => setExpanded(!expanded)}>
              {expanded ? (
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
                    d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                  />
                </svg>
              ) : (
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
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              )}
            </button>
          </th>
        </tr>
      </thead>
      <tbody className="flex min-h-[40px] flex-col overflow-hidden py-2">
        {expanded &&
          data.values.map((val) => (
            <tr key={val} className={styles.row}>
              <td className=" flex px-4 ">{val}</td>
            </tr>
          ))}
        {!expanded && (
          <tr className="px-4 font-thin opacity-50">
            <td>{data.values.length} hidden fields...</td>
          </tr>
        )}
      </tbody>
      <Handle
        className={clsx([styles.handle, styles.bottom])}
        type="source"
        id={data.name + "-handle"}
        position={Position.Bottom}
        isConnectable={false}
      />
    </table>
  );
};

export interface EnumNodeProps {
  data: EnumNodeData;
}

export default EnumNode;
