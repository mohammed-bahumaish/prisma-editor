"use client";

import dynamic from "next/dynamic";
export default dynamic(() => import("~/components/editor/editor"), {
  ssr: false,
});
