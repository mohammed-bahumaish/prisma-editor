import clsx from "clsx";
import { Handle, Position } from "reactflow";
import { type EnumNodeData } from "../util/types";
import styles from "./styles.module.scss";
import AddOrUpdateEnumModal from "../components/AddOrUpdateEnumModal";

const EnumNode = ({ data }: EnumNodeProps) => {
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
            <AddOrUpdateEnumModal model={data.name}>
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
            </AddOrUpdateEnumModal>
          </th>
        </tr>
      </thead>
      <tbody className="flex min-h-[40px] flex-col overflow-hidden py-2">
        {data.values.map((val) => (
          <tr key={val} className={styles.row}>
            <td className=" flex px-4 ">
              <AddOrUpdateEnumModal model={data.name} field={val}>
                <>{val}</>
              </AddOrUpdateEnumModal>
            </td>
          </tr>
        ))}
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
