import Editor, { useMonaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useDebounce, useShallowCompareEffect } from "react-use";
import { shallow } from "zustand/shallow";
import { useSchemaStore } from "../store/schemaStore";
import * as prismaLanguage from "./util/prismaLang";

const PrismaEditor = () => {
  const { parseSchema, schema, setSchema, schemaErrors, permission } =
    useSchemaStore()(
      (state) => ({
        schema: state.schema,
        schemaErrors: state.schemaErrors,
        parseSchema: state.parseSchema,
        permission: state.permission,
        setSchema: state.setSchema,
      }),
      shallow
    );
  const readOnly = permission === "VIEW";

  useDebounce(
    () => {
      if (readOnly) return;
      void parseSchema(schema);
    },
    1000,
    [schema]
  );

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

  const { resolvedTheme } = useTheme();

  return (
    <div className="h-full">
      <Editor
        key="prisma"
        language="prisma"
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        loading="Loading..."
        path="prisma"
        options={{
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          scrollBeyondLastLine: true,
          readOnly,
        }}
        value={schema}
        onChange={(value: string | undefined) => {
          setSchema(value || "");
        }}
      />
    </div>
  );
};

export default PrismaEditor;
