import Editor, { useMonaco } from "@monaco-editor/react";
import { useDebounce, useShallowCompareEffect } from "react-use";
import { createSchemaStore } from "../store/schemaStore";
import { useRef } from "react";
import { type editor } from "monaco-editor";

const SqlEditor = () => {
  const { sql, setSql, sqlErrorMessage } = createSchemaStore((state) => ({
    sql: state.sql,
    sqlErrorMessage: state.sqlErrorMessage,
    setSql: state.setSql,
  }));

  const allow = useRef(false);
  useDebounce(
    () => {
      if (!allow.current) return;
      void setSql(sql, true);
    },
    1000,
    [sql]
  );

  const monaco = useMonaco();
  useShallowCompareEffect(() => {
    if (!monaco) return;
    const markers: editor.IMarkerData[] = sqlErrorMessage
      ? [
          {
            message: sqlErrorMessage,
            startLineNumber: Number(0),
            endLineNumber: Infinity,
            startColumn: 0,
            endColumn: 9999,
            severity: 8,
          },
        ]
      : [];

    const model = monaco.editor
      .getModels()
      .find((m) => m.getLanguageId() === "sql");

    if (model) monaco.editor.setModelMarkers(model, "sql", markers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sqlErrorMessage]);

  return (
    <div className="h-full w-full">
      <Editor
        key="sql"
        height="calc(100% - 36px)"
        language="sql"
        theme="vs-dark"
        loading="Loading..."
        path="sql"
        options={{
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          scrollBeyondLastLine: true,
        }}
        value={sql}
        onChange={(value: string | undefined) => {
          allow.current = true;
          void setSql(value || "");
        }}
      />
    </div>
  );
};

export default SqlEditor;
