import Editor, { useMonaco } from "@monaco-editor/react";
import { useYDoc } from "app/yDocContext";
import { type editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MonacoBinding } from "y-monaco";
import * as prismaLanguage from "./util/prismaLang";

const PrismaEditor = () => {
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null
  );
  const { provider, ydoc } = useYDoc();

  const monaco = useMonaco();
  const model = monaco?.editor
    .getModels()
    .find((m) => m.getLanguageId() === "prisma");

  useEffect(() => {
    if (!model || !editor || !provider) return;

    const schema = ydoc.getText("schema");

    const monacoBinding = new MonacoBinding(
      schema,
      model,
      new Set([editor]),
      provider.awareness
    );

    return () => {
      monacoBinding.destroy();
    };
  }, [model, editor, ydoc, provider?.awareness, provider]);

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

  //   if (model) monaco.editor.setModelMarkers(model, "schema", markers);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [schemaErrors]);

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
        }}
        onMount={(editor) => setEditor(editor)}
      />
    </div>
  );
};

export default PrismaEditor;
