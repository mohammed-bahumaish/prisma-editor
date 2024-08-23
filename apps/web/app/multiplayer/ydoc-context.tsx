/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import {
  type ConfigMetaFormat,
  type ConnectorType,
  type DMMF,
} from "@prisma-editor/prisma-dmmf-extended";

import { fromUint8Array, toUint8Array } from "js-base64";
import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "react-use";
import { bind } from "valtio-yjs";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { dmmfToElements } from "~/components/diagram/util/dmmfToFlow";
import { apiClient } from "~/utils/api";
import { autoLayout, getLayout } from "~/utils/layout";
import { type Message, multiplayerState } from "./multiplayer-state";

// Type definitions
export interface DMMFProps {
  datamodel: DMMF.Document["datamodel"];
  config: ConfigMetaFormat;
}

type StateHook<T> = [T, React.Dispatch<React.SetStateAction<T>>];

// Context interface
interface MultiplayerContextType {
  ydoc: Y.Doc;
  provider: WebrtcProvider | undefined;
  getDmmf: () => Promise<DMMFProps | undefined>;
  setDmmf: React.Dispatch<React.SetStateAction<DMMFProps>>;
  isSavingState: StateHook<boolean>;
  editorFocusState: StateHook<boolean>;
  diagramFocusRef: React.MutableRefObject<boolean>;
  madeChangesState: StateHook<boolean>;
  isViewOnly: boolean;
  // diagramLayoutState: StateHook<ElkNode | undefined>;
  dmmf: DMMFProps;
  connector: ConnectorType;
  autoNodesLayout: () => Promise<void>;
  users: Message["sender"][];
}

// Default context values
const defaultContextValue: MultiplayerContextType = {
  ydoc: new Y.Doc(),
  provider: undefined,
  getDmmf: async () => undefined,
  setDmmf: () => { },
  isSavingState: [false, () => { }],
  editorFocusState: [false, () => { }],
  diagramFocusRef: { current: false },
  madeChangesState: [false, () => { }],
  isViewOnly: false,
  // diagramLayoutState: [undefined, () => { }],
  dmmf: {} as DMMFProps,
  connector: "postgres",
  autoNodesLayout: async () => { },
  users: [],
};

// Create and export the context
export const MultiplayerContext =
  createContext<MultiplayerContextType>(defaultContextValue);

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
  const [dmmf, setDmmf] = useState<DMMFProps>({
    config: undefined as unknown as any,
    datamodel: undefined as unknown as any,
  });
  const editorFocusState = useState(false);
  const diagramFocusRef = useRef(false);
  const madeChangesState = useState(false);
  const isSavingState = useState(false);
  // const diagramLayoutState = useState<ElkNode>();
  const session = useSession();
  const [users, setUsers] = useState<Message["sender"][]>([]);

  useEffect(() => {
    const provider = new WebrtcProvider(room.toString(), ydoc, {
      // signaling: ["wss://http://localhost:4000"],
      signaling: ["wss://prisma-editor-webrtc-signaling-server.onrender.com"],
    });
    setProvider(provider);

    provider.awareness.on("change", () => {
      const users = (
        Array.from(provider.awareness.getStates().values()) as {
          user: Message["sender"];
        }[]
      ).map((state) => {
        return state.user;
      });
      setUsers(users);
    });

    provider.awareness.setLocalStateField("user", {
      name: session.data?.user.name || "Anonymous",
      image: session.data?.user.image || "/images/placeholder.jpg",
      id: session.data?.user.id || "",
    } satisfies Message["sender"]);

    return () => {
      provider.destroy();
    };
  }, [
    room,
    session.data?.user.id,
    session.data?.user.image,
    session.data?.user.name,
    ydoc,
  ]);

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
          const layout = getLayout(
            multiplayerState.nodes
          );
          setDmmf({ datamodel: result.datamodel, config: result.config });
          const { nodes, edges } = dmmfToElements(
            result.datamodel,
            layout
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
        diagramFocusRef.current === true ||
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
  }, [mutate, room, ydoc]);

  return (
    <MultiplayerContext.Provider
      value={{
        ydoc,
        provider,
        getDmmf,
        setDmmf,
        dmmf,
        editorFocusState,
        diagramFocusRef,
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
    </MultiplayerContext.Provider>
  );
};

export const useYDoc = () => React.useContext(MultiplayerContext);
