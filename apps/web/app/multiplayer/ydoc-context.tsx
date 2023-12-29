"use client";
import {
  type DMMF,
  type ConfigMetaFormat,
} from "@prisma-editor/prisma-dmmf-extended";

import { fromUint8Array, toUint8Array } from "js-base64";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { bind } from "valtio-yjs";

import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { multiplayerState } from "./multiplayer-state";
import { apiClient } from "~/utils/api";
import { useDebounce } from "react-use";
import { dmmfToElements } from "~/components/diagram/util/dmmfToFlow";
import { useSnapshot } from "valtio";
import { saveDocState } from "app/schema/saveDocState";

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
  editorFocusState: undefined as unknown as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ],
  diagramFocusState: undefined as unknown as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
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

  //// save state to database

  // save schema to database
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
          const { nodes, edges } = dmmfToElements(result.datamodel, null);
          multiplayerState.nodes = nodes;
          multiplayerState.edges = edges;
        }

        multiplayerState.parseErrors = result.errors || [];

        await saveDocState({
          docState: fromUint8Array(Y.encodeStateAsUpdate(ydoc)),
          schemaId: -1,
        });
      }
    },
    500,
    [schema]
  );
  //

  // save diagram to database
  const snap = useSnapshot(multiplayerState);
  const nodesPositions = useMemo(
    () =>
      snap.nodes.map((n) => `${n.id}-${n.position.x}-${n.position.y}`).join(""),
    [snap.nodes]
  );
  useDebounce(
    async () => {
      if (diagramFocusState[0] === false) return;
      await saveDocState({
        docState: fromUint8Array(Y.encodeStateAsUpdate(ydoc)),
        schemaId: -1,
      });
    },
    1000,
    [nodesPositions]
  );
  //
  ///

  return (
    <multiplayerContext.Provider
      value={{
        ydoc,
        provider,
        getDmmf,
        setDmmf,
        editorFocusState,
        diagramFocusState,
      }}
    >
      {children}
    </multiplayerContext.Provider>
  );
};

export const useYDoc = () => React.useContext(multiplayerContext);
