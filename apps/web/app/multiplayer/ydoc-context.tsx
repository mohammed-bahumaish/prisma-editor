/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import {
  type ConfigMetaFormat,
  type ConnectorType,
  type DMMF,
} from "@prisma-editor/prisma-dmmf-extended";

import { fromUint8Array, toUint8Array } from "js-base64";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { bind } from "valtio-yjs";

import { type ElkNode } from "elkjs";
import { useSession } from "next-auth/react";
import { useDebounce } from "react-use";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { dmmfToElements } from "~/components/diagram/util/dmmfToFlow";
import { apiClient } from "~/utils/api";
import { autoLayout } from "~/utils/layout";
import { multiplayerState } from "./multiplayer-state";

export type dmmfProps = {
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
  isViewOnly: undefined as unknown as boolean,
  diagramLayoutState: undefined as unknown as [
    ElkNode | undefined,
    React.Dispatch<React.SetStateAction<ElkNode | undefined>>
  ],
  dmmf: {} as unknown as dmmfProps,
  connector: "postgres" as ConnectorType,
  autoNodesLayout: undefined as unknown as () => Promise<void>,
  users: [] as { name: string; avatar?: string }[],
});

export const YDocProvider = ({
  children,
  room,
  yDocUpdate,
  isViewOnly,
}: {
  children: React.ReactNode;
  room: number;
  yDocUpdate?: string;
  isViewOnly: boolean;
}) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [provider, setProvider] = useState<WebrtcProvider>();
  const [dmmf, setDmmf] = useState<dmmfProps>({
    config: undefined as unknown as any,
    datamodel: undefined as unknown as any,
  });
  const editorFocusState = useState(false);
  const diagramFocusState = useState(false);
  const madeChangesState = useState(false);
  const isSavingState = useState(false);
  const diagramLayoutState = useState<ElkNode>();
  const session = useSession();
  const [users, setUsers] = useState<{ name: string; avatar?: string }[]>([]);

  useEffect(() => {
    const provider = new WebrtcProvider(room.toString(), ydoc, {
      signaling: ["wss://prisma-editor-webrtc-signaling-server.onrender.com"],
    });
    setProvider(provider);

    provider.awareness.on("change", () => {
      const users = (
        Array.from(provider.awareness.getStates().values()) as {
          user: { name: string; avatar?: string };
        }[]
      ).map((state) => {
        return state.user;
      });
      setUsers(users);
    });

    provider.awareness.setLocalStateField("user", {
      name: session.data?.user.name || "Anonymous",
      avatar: session.data?.user.image,
    });

    return () => {
      provider.destroy();
    };
  }, [room, session.data?.user.image, session.data?.user.name, ydoc]);

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
    if ("datamodel" in result && "config" in result) {
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

  const autoNodesLayout = async () => {
    const layout = await autoLayout(
      multiplayerState.nodes,
      multiplayerState.edges
    );
    const { nodes, edges } = dmmfToElements(dmmf.datamodel, layout);
    multiplayerState.nodes = nodes;
    multiplayerState.edges = edges;
    madeChangesState[1](true);
  };

  useDebounce(
    async () => {
      if (schema) {
        const result = await apiClient.dmmf.schemaToDmmf.mutate(schema);

        if ("datamodel" in result && result.datamodel) {
          setDmmf({ datamodel: result.datamodel, config: result.config });
          const { nodes, edges } = dmmfToElements(
            result.datamodel,
            diagramLayoutState[0] || null
          );
          multiplayerState.nodes = nodes;
          multiplayerState.edges = edges;
        }

        if ("errors" in result) {
          multiplayerState.parseErrors = result.errors;
        } else {
          multiplayerState.parseErrors = [];
        }
      }
    },
    500,
    [schema]
  );

  const { mutate } = apiClient.manageSchema.saveDocState;

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        isSavingState[0] === true ||
        madeChangesState[0] === false ||
        isViewOnly
      )
        return;

      void (async () => {
        isSavingState[1](true);
        madeChangesState[1](false);
        await mutate({
          docState: fromUint8Array(Y.encodeStateAsUpdate(ydoc)),
          id: room,
        });
        isSavingState[1](false);
      })();
    }, 5000);

    return () => clearInterval(interval);
  }, [isSavingState, isViewOnly, madeChangesState, mutate, room, ydoc]);

  return (
    <multiplayerContext.Provider
      value={{
        ydoc,
        provider,
        getDmmf,
        setDmmf,
        dmmf,
        editorFocusState,
        diagramFocusState,
        diagramLayoutState,
        isSavingState,
        madeChangesState,
        isViewOnly,
        connector:
          dmmf.config?.datasources.find((d) => !!d.provider)?.provider ||
          "postgres",
        autoNodesLayout,
        users,
      }}
    >
      {children}
    </multiplayerContext.Provider>
  );
};

export const useYDoc = () => React.useContext(multiplayerContext);
