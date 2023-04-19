import Editor, { useMonaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { useEffect, useState } from "react";
import { useDebounce, useShallowCompareEffect } from "react-use";
import { useSchemaStore } from "../store/schemaStore";
import * as prismaLanguage from "./util/prismaLang";
import { shallow } from "zustand/shallow";
import { useTheme } from "next-themes";

const PrismaEditor = () => {
  const { setSchema, schema, schemaErrors } = useSchemaStore()(
    (state) => ({
      schema: state.schema,
      schemaErrors: state.schemaErrors,
      setSchema: state.setSchema,
    }),
    shallow
  );
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

  const { theme } = useTheme();

  return (
    <div className="h-full">
      <Editor
        key="prisma"
        language="prisma"
        theme={theme === "dark" ? "vs-dark" : "vs"}
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
        // onMount={(editor) => {
        //   editor.addAction({
        //     id: "format",
        //     label: "Format",
        //     contextMenuGroupId: "format",
        //     run: () => {

        //     },
        //   });
        // }}
      />
    </div>
  );
};

export default PrismaEditor;
