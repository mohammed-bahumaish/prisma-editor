"use client";

import dynamic from "next/dynamic";
export const CodeEditor = dynamic(
  () => import("~/components/editor/codeEditor"),
  {
    ssr: false,
  }
);
