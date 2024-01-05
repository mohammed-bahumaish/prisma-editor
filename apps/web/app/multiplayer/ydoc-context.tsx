"use client";
import {
  type ConfigMetaFormat,
  type DMMF,
} from "@prisma-editor/prisma-dmmf-extended";

import { fromUint8Array, toUint8Array } from "js-base64";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { bind } from "valtio-yjs";

import { saveDocState } from "app/schema/saveDocState";
import { type ElkNode } from "elkjs";
import { useDebounce } from "react-use";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { dmmfToElements } from "~/components/diagram/util/dmmfToFlow";
import { apiClient } from "~/utils/api";
import { multiplayerState } from "./multiplayer-state";

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
  isSavingState: undefined as unknown as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ],
  editorFocusState: undefined as unknown as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ],
  diagramFocusState: undefined as unknown as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ],
  madeChangesState: undefined as unknown as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ],
  diagramLayoutState: undefined as unknown as [
    ElkNode | undefined,
    React.Dispatch<React.SetStateAction<ElkNode | undefined>>
  ],
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
  const editorFocusState = useState(false);
  const diagramFocusState = useState(false);
  const madeChangesState = useState(false);
  const isSavingState = useState(false);
  const diagramLayoutState = useState<ElkNode>();

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

  // parse schema
  const [schema, setSchema] = useState("");
  const _schema = ydoc.getText("schema");

  _schema.observe(() => {
    if (!_schema.toString()) return;
    setSchema(_schema.toString());
  });

  useDebounce(
    async () => {
      if (schema && editorFocusState[0] === true) {

        const result = await apiClient.dmmf.schemaToDmmf.mutate(schema);

        if (result.datamodel) {
          setDmmf({ datamodel: result.datamodel, config: result.config });
          const { nodes, edges } = dmmfToElements(
            result.datamodel,
            diagramLayoutState[0] || null
          );
          multiplayerState.nodes = nodes;
          multiplayerState.edges = edges;
        }

        multiplayerState.parseErrors = result.errors || [];
      }
    },
    500,
    [schema]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      void (async () => {
        if (isSavingState[0] === true || madeChangesState[0] === false) return;
        isSavingState[1](true);
        madeChangesState[1](false);
        await saveDocState({
          docState: fromUint8Array(Y.encodeStateAsUpdate(ydoc)),
          schemaId: -1,
        });
        isSavingState[1](false);
      })();
    }, 5000);

    return () => clearInterval(interval);
  }, [isSavingState, madeChangesState, ydoc]);

  return (
    <multiplayerContext.Provider
      value={{
        ydoc,
        provider,
        getDmmf,
        setDmmf,
        editorFocusState,
        diagramFocusState,
        diagramLayoutState,
        isSavingState,
        madeChangesState
      }}
    >
      {children}
    </multiplayerContext.Provider>
  );
};

export const useYDoc = () => React.useContext(multiplayerContext);
