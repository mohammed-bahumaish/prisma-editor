import { useSchema } from "../schemaContext/schemaContext";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import * as prismaLanguage from "./util/prismaLang";

const EditorView = () => {
  const { prismaSchema, setPrismaSchema } = useSchema();
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

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        language="prisma"
        theme="vs-dark"
        loading="Loading..."
        path="schema.prisma"
        options={{
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: true,
          scrollBeyondLastLine: true,
        }}
        value={prismaSchema}
        onChange={setPrismaSchema as any}
      />
    </div>
  );
};

export default EditorView;
