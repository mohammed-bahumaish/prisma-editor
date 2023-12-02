"use client";

import { toUint8Array } from "js-base64";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

const YDocContext = createContext({
  ydoc: new Y.Doc(),
  provider: undefined as undefined | WebrtcProvider,
});

export const YDocProvider = ({
  children,
  room,
  yDocUpdate,
}: {
  children: React.ReactNode;
  room: string;
  yDocUpdate?: string;
}) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [provider, setProvider] = useState<WebrtcProvider>();

  useEffect(() => {
    const provider = new WebrtcProvider(room, ydoc, {
      signaling: ["ws://localhost:4444"],
    });
    setProvider(provider);

    return () => {
      provider.destroy();
    };
  }, [room, ydoc]);

  useEffect(() => {
    if (yDocUpdate) {
      Y.applyUpdate(ydoc, toUint8Array(yDocUpdate));
    }
  }, [yDocUpdate, ydoc]);

  return (
    <YDocContext.Provider value={{ ydoc, provider }}>
      {children}
    </YDocContext.Provider>
  );
};

export const useYDoc = () => React.useContext(YDocContext);
