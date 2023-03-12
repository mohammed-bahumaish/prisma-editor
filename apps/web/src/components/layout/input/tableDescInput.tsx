import { useEffect, useRef } from "react";
import { apiClient } from "~/utils/api";

export default function TableDescInput() {
  const ref = useRef<HTMLTextAreaElement>();

  function onExpandableTextareaInput(e: any) {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  async function generateSqlTables(): Promise<void> {
    if (ref.current?.value === "") return;
    let result = await apiClient.openai.sqlTables.mutate(ref.current?.value!);
    console.log(result);
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <textarea
        ref={ref as any}
        onKeyDown={onExpandableTextareaInput}
        className=" border-brand-indigo-2 bg-brand-dark m-4 h-20 w-3/4 overflow-hidden rounded-xl p-4 text-white shadow-xl"
      ></textarea>
      <button
        className="bg-brand-indigo-2  mb-4  w-3/4 overflow-hidden rounded-xl p-2 text-white shadow-xl"
        onClick={() => generateSqlTables()}
      >
        Generate SQL Tables
      </button>
    </div>
  );
}
