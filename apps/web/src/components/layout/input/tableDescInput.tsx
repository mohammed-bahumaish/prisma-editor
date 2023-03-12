import { useState } from "react";
import { apiClient } from "~/utils/api";

export default function TableDescInput() {
  const [prompt, setPrompt] = useState("");

  const generateSqlTables = () => {
    void apiClient.openai.sqlTables.mutate(prompt);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className=" border-brand-indigo-2 bg-brand-dark m-4 h-20 w-3/4 overflow-hidden rounded-xl p-4 text-white shadow-xl"
      />
      <button
        className="bg-brand-indigo-2  mb-4  w-3/4 overflow-hidden rounded-xl p-2 text-white shadow-xl"
        onClick={() => generateSqlTables()}
      >
        Generate SQL Tables
      </button>
    </div>
  );
}
