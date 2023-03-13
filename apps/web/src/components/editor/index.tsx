"use client";

import dynamic from "next/dynamic";
export const CodeEditor = dynamic(
  () => import("~/components/editor/codeEditor"),
  {
    ssr: false,
  }
);
export const PromptEditor = dynamic(
  () => import("~/components/editor/promptEditor"),
  {
    ssr: false,
  }
);
