"use client";

import dynamic from "next/dynamic";
export const PrismaEditor = dynamic(
  () => import("~/components/editor/prismaEditor"),
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
