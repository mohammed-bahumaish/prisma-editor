import Editor, { useMonaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { useEffect } from "react";
import { useSchemaStore } from "../store/schemaStore";
import { shallow } from "zustand/shallow";
import { useTheme } from "next-themes";

const SqlEditor = () => {
  const { sql, sqlErrorMessage, parseToSql } = useSchemaStore()(
    (state) => ({
      sql: state.sql,
      sqlErrorMessage: state.sqlErrorMessage,
      parseToSql: state.parseToSql,
    }),
    shallow
  );

  const monaco = useMonaco();
  useEffect(() => {
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

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    void parseToSql();
  }, [parseToSql]);

  return (
    <div className="h-full w-full">
      <Editor
        key="sql"
        language="sql"
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        loading="Loading..."
        path="sql"
        options={{
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          scrollBeyondLastLine: true,
          readOnly: true,
        }}
        value={sql}
      />
    </div>
  );
};

export default SqlEditor;
