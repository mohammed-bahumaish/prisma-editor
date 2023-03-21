import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import Loading from "../shared/loading";
import { createSchemaStore } from "../store/schemaStore";

const PromptEditor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  const { setSchema, prompt, setPrompt } = createSchemaStore((state) => ({
    setSchema: state.setSchema,
    prompt: state.prompt,
    setPrompt: state.setPrompt,
  }));

  const { mutate, isLoading } = api.openai.prismaAiPrompt.useMutation({
    onSuccess(data) {
      void setSchema(data);
    },
  });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, {
      capture: true,
    });
    window.addEventListener("mousedown", handleClickOutside, {
      capture: true,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleKeyDown]);

  const handleClickOutside = (event: MouseEvent) => {
    if (drawer.current && drawer.current.contains(event.target as Node)) {
      setIsOpen(true);
    } else setIsOpen(false);
  };

  return (
    <div
      ref={drawer}
      className={clsx(
        "bg-brand-darker border-brand-dark fixed bottom-0 left-1/2 z-50 flex w-[90vw] -translate-x-1/2 flex-col items-center justify-center rounded-md rounded-b-none border-[1px] border-b-0 pt-4 text-gray-100 duration-300 ease-in-out md:w-[500px]",
        isOpen ? "" : "translate-y-[83%] cursor-pointer bg-opacity-5"
      )}
    >
      <div className="absolute top-2 h-1 w-20 rounded-full bg-white/90"></div>
      <div>Describe your database bellow</div>
      <div className="flex w-full items-center justify-center">
        <textarea
          placeholder="A school with teachers ..."
          onChange={(e) => setPrompt(e.target.value)}
          className="custom-scrollbar border-brand-light-edge bg-brand-darker m-2 w-full resize-none rounded-lg text-gray-100 shadow-xl"
          value={prompt}
        />
        <div className="mr-2">
          {isLoading ? (
            <Loading />
          ) : (
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white"
              onClick={() => {
                mutate(prompt);
              }}
              disabled={isLoading}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className=" h-4 w-4 translate-y-[1px] -translate-x-[1px]"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptEditor;
