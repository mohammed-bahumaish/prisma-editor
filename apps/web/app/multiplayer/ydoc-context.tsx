"use client";
import {
  type DMMF,
  type ConfigMetaFormat,
} from "@prisma-editor/prisma-dmmf-extended";

import { toUint8Array } from "js-base64";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { bind } from "valtio-yjs";

import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { multiplayerState } from "./multiplayer-state";
import { apiClient } from "~/utils/api";

type dmmfProps = {
  datamodel: DMMF.Document["datamodel"];
  config: ConfigMetaFormat;
};

const multiplayerContext = createContext({
  ydoc: new Y.Doc(),
  provider: undefined as undefined | WebrtcProvider,
  getDmmf: undefined as unknown as () => Promise<dmmfProps | undefined>,
  setDmmf: undefined as unknown as React.Dispatch<
    React.SetStateAction<dmmfProps>
  >,
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
  const [dmmf, setDmmf] = useState<dmmfProps>({
    config: undefined,
    datamodel: undefined,
  });

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

  useEffect(() => {
    const unbind = bind(multiplayerState, ydoc.getMap("multiplayer-state"));
    return () => unbind();
  }, [ydoc]);

  const getDmmf = async () => {
    if (dmmf) return dmmf;
    const result = await apiClient.dmmf.schemaToDmmf.mutate(
      ydoc.getText("schema").toString()
    );
    if (result.datamodel) {
      setDmmf({
        datamodel: result.datamodel,
        config: result.config,
      });
      return {
        datamodel: result.datamodel,
        config: result.config,
      };
    }
  };

  return (
    <multiplayerContext.Provider
      value={{
        ydoc,
        provider,
        getDmmf,
        setDmmf,
      }}
    >
      {children}
    </multiplayerContext.Provider>
  );
};

export const useYDoc = () => React.useContext(multiplayerContext);
