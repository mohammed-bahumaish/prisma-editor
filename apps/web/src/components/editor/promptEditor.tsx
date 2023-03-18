import Editor from "@monaco-editor/react";
import { api } from "~/utils/api";
import { createSchemaStore } from "../store/schemaStore";

const PromptEditor = () => {
  const { setSchema, prompt, setPrompt } = createSchemaStore((state) => ({
    setSchema: state.setSchema,
    prompt: state.prompt,
    setPrompt: state.setPrompt,
  }));

  // use this in case you want to show errors in prompt command
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

  const { mutate, isLoading } = api.openai.prismaAiPrompt.useMutation({
    onSuccess(data) {
      void setSchema(data);
    },
  });

  return (
    <div className="h-full w-full">
      <div className="flex justify-between px-4 py-2 text-sm text-gray-100">
        <div className="cursor-pointer underline decoration-from-font underline-offset-8">
          AI Prompt
        </div>
        <div>
          <button
            className="hover:bg-brand-dark bottom-1.5 right-1 rounded-md p-1 text-gray-100"
            onClick={() => {
              mutate(prompt);
            }}
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </div>
      <Editor
        height="calc(100% - 43px)"
        language="plaintext"
        theme="vs-dark"
        loading="Loading..."
        path="prompt"
        options={{
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          scrollBeyondLastLine: true,
          lineNumbers: "off",
        }}
        value={prompt}
        onChange={(value: string | undefined) => {
          setPrompt(value || "");
        }}
      />
    </div>
  );
};

export default PromptEditor;
