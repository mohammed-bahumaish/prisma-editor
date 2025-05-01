"use client";

import { useYDoc } from "app/multiplayer/ydoc-context";
import Header from "~/components/layout/header/header";

export const SchemaHeader = () => {
  const { isSavingState, users } = useYDoc();

  return <Header isSaving={isSavingState[0]} users={users} />;
};
