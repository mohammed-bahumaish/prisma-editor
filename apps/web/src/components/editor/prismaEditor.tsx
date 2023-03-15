import Editor, { useMonaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { useEffect, useState } from "react";
import { useDebounce, useShallowCompareEffect } from "react-use";
import { createSchemaStore } from "../store/schemaStore";
import * as prismaLanguage from "./util/prismaLang";

const PrismaEditor = () => {
  const { setSchema, schema, schemaErrors } = createSchemaStore((state) => ({
    schema: state.schema,
    schemaErrors: state.schemaErrors,
    setSchema: state.setSchema,
    setSql: state.setSql,
  }));
  const [localSchema, setLocalSchema] = useState("");

  useDebounce(
    () => {
      void setSchema(localSchema);
    },
    1000,
    [localSchema]
  );

  useEffect(() => {
    setLocalSchema(schema);
  }, [schema]);

  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "prisma" });
      monaco.languages.setLanguageConfiguration(
        "prisma",
        prismaLanguage.config
      );
      monaco.languages.setMonarchTokensProvider(
        "prisma",
        prismaLanguage.language
      );
    }
  }, [monaco]);

  useShallowCompareEffect(() => {
    if (!monaco) return;
    const markers = schemaErrors.map<editor.IMarkerData>((err) => ({
      message: err.reason,
      startLineNumber: Number(err.row),
      endLineNumber: Number(err.row),
      startColumn: 0,
      endColumn: 9999,
      severity: 8,
    }));

    const model = monaco.editor
      .getModels()
      .find((m) => m.getLanguageId() === "prisma");
    if (model) monaco.editor.setModelMarkers(model, "schema", markers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaErrors]);

  return (
    <div className="h-full">
      <Editor
        key="prisma"
        height="calc(100% - 36px)"
        language="prisma"
        theme="vs-dark"
        loading="Loading..."
        path="prisma"
        options={{
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          scrollBeyondLastLine: true,
        }}
        value={localSchema}
        onChange={(value: string | undefined) => {
          setLocalSchema(value || "");
        }}
      />
    </div>
  );
};

export default PrismaEditor;
