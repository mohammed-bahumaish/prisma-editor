import Editor, { useMonaco } from "@monaco-editor/react";
import { multiplayerState } from "app/multiplayer/multiplayer-state";
import { useYDoc } from "app/multiplayer/ydoc-context";
import { type editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { MonacoBinding } from "y-monaco";
import * as prismaLanguage from "./util/prismaLang";

const PrismaEditor = () => {
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null
  );

  const { provider, ydoc, editorFocusState, madeChangesState } = useYDoc();
  const schema = useMemo(() => ydoc.getText("schema"), [ydoc]);

  const monaco = useMonaco();
  const model = monaco?.editor
    .getModels()
    .find((m) => m.getLanguageId() === "prisma");

  useEffect(() => {
    if (!model || !editor || !provider) return;

    const monacoBinding = new MonacoBinding(
      schema,
      model,
      new Set([editor]),
      provider.awareness
    );

    return () => {
      monacoBinding.destroy();
    };
  }, [model, editor, ydoc, provider?.awareness, provider, schema]);

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

  const snap = useSnapshot(multiplayerState);

  useEffect(() => {
    if (!monaco) return;
    const markers = snap.parseErrors.map<editor.IMarkerData>((err) => ({
      message: err.reason,
      startLineNumber: Number(err.row),
      endLineNumber: Number(err.row),
      startColumn: 0,
      endColumn: 9999,
      severity: 8,
    }));

    if (model) monaco.editor.setModelMarkers(model, "schema", markers);
  }, [model, monaco, snap.parseErrors]);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!editor) return;
    editor.onDidBlurEditorWidget(() => {
      if (editorFocusState[0] === false) return;
      setTimeout(() => {
        editorFocusState[1](false);
      }, 1000);
    });
    editor.onKeyDown((e) => {
      madeChangesState[1](true)
      if (editorFocusState[0] === true) return;
      editorFocusState[1](true);
    })

  }, [editor, editorFocusState, madeChangesState]);

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
