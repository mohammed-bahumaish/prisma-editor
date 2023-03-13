import Editor from "@monaco-editor/react";
import { useDebounce } from "react-use";
import { createSchemaStore } from "../store/schemaStore";

const SqlEditor = () => {
  const { sql, setSql } = createSchemaStore((state) => ({
    sql: state.sql,
    setSql: state.setSql,
  }));

  useDebounce(
    () => {
      void setSql(sql, true);
    },
    1000,
    [sql]
  );

  // useShallowCompareEffect(() => {
  //   if (!monaco) return;
  //   const markers = schemaErrors.map<editor.IMarkerData>((err) => ({
  //     message: err.reason,
  //     startLineNumber: Number(err.row),
  //     endLineNumber: Number(err.row),
  //     startColumn: 0,
  //     endColumn: 9999,
  //     severity: 8,
  //   }));

  //   const [model] = monaco.editor.getModels();
  //   if (model) monaco.editor.setModelMarkers(model, "prisma-editor", markers);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [schemaErrors]);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language="sql"
        theme="vs-dark"
        loading="Loading..."
        path="schema.prisma"
        options={{
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          scrollBeyondLastLine: true,
        }}
        value={sql}
        onChange={(value: string | undefined) => {
          void setSql(value || "");
        }}
      />
    </div>
  );
};

export default SqlEditor;
