import { useMonaco } from "@monaco-editor/react";
import {
  type ConfigMetaFormat,
  type DMMF,
} from "@prisma-editor/prisma-dmmf-extended";
import { type ElkNode } from "elkjs";
import { type editor } from "monaco-editor";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDebounce, useLocalStorage } from "react-use";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlowProvider,
} from "reactflow";
import useSWRMutation from "swr/mutation";
import { dmmfToElements } from "~/components/diagram/util/dmmfToFlow";
import {
  type DMMFToElementsResult,
  type SchemaError,
} from "~/components/diagram/util/types";
import {
  type addFieldProps,
  PARSE_DELAY,
  SchemaContext,
  type useSchemaI,
} from "~/components/schemaContext/util/types";
import { defaultSchema, mutator } from "~/components/schemaContext/util/util";
import { api } from "~/utils/api";
import { autoLayout, getLayout } from "./util/layout";

const SchemaContext = createContext<SchemaContext>(undefined as never);

export const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const [storedSchema, setStoredSchema] = useLocalStorage(
    "prisma.schema",
    defaultSchema
  );

  const schemaState = useState(storedSchema || defaultSchema);
  const [schema] = schemaState;
  useEffect(() => {
    setStoredSchema(schema);
  }, [schema, setStoredSchema]);

  const [storedLayout, setStoredLayout] =
    useLocalStorage<string>("prisma.layout");

  const layoutState = useState<ElkNode | null>(
    storedLayout ? (JSON.parse(storedLayout) as ElkNode) : null
  );
  const [layout] = layoutState;
  useEffect(() => {
    if (layout) setStoredLayout(JSON.stringify(layout));
  }, [layout, setStoredLayout]);

  const dmmfState = useState<DMMF.Document["datamodel"]>();
  const configState = useState<ConfigMetaFormat>();
  const nodesState = useState<DMMFToElementsResult["nodes"]>([]);
  const edgesState = useState<DMMFToElementsResult["edges"]>([]);

  const editorConfigState = useState({
    allowParsing: true,
  });

  return (
    <SchemaContext.Provider
      value={{
        schemaState,
        dmmfState,
        configState,
        editorConfigState,
        diagramState: {
          nodesState,
          edgesState,
          layoutState,
        },
      }}
    >
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </SchemaContext.Provider>
  );
};

export const useSchema = (): useSchemaI => {
  const context = useContext(SchemaContext);
  const [prismaSchema, setPrismaSchema] = context.schemaState;
  const [dmmf, setDmmf] = context.dmmfState;
  const [config, setConfig] = context.configState;
  const [nodes, setNodes] = context.diagramState.nodesState;
  const [edges, setEdges] = context.diagramState.edgesState;
  const [layout, setLayout] = context.diagramState.layoutState;
  const [editorConfig, setEditorConfig] = context.editorConfigState;
  const { allowParsing } = editorConfig;
  const monaco = useMonaco();

  const setAllowParsing = useCallback(
    (allow: boolean) => {
      console.log("ran: setAllowParsing");
      if (editorConfig.allowParsing === !allow)
        setEditorConfig({ ...editorConfig, allowParsing: allow });
    },
    [editorConfig, setEditorConfig]
  );

  const setSchema = useCallback(
    (schema: string) => {
      console.log("ran: setSchema");

      setAllowParsing(true);
      setPrismaSchema(schema);
    },
    [setAllowParsing, setPrismaSchema]
  );

  const handleDmmfChange = useCallback(() => {
    console.log("ran: handleDmmfChange");

    const { nodes, edges } = dmmf
      ? dmmfToElements(dmmf, layout)
      : ({ nodes: [], edges: [] } as DMMFToElementsResult);

    setNodes(nodes);
    setEdges(edges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dmmf, layout]);

  useDebounce(handleDmmfChange, PARSE_DELAY, [dmmf]);

  const handleLayoutChange = useCallback(async () => {
    console.log("ran: handleLayoutChange");

    if (!nodes || !(nodes.length > 0)) return;
    const l = layout || (await autoLayout(nodes, edges));
    const newLayout = await getLayout(nodes, edges, l);
    setLayout(newLayout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, nodes, edges]);

  useDebounce(handleLayoutChange, PARSE_DELAY, [nodes]);

  const { error: schemaToSqlError, trigger: getSchemaToSql } = useSWRMutation(
    "/api/schemaToSql",
    mutator,
    {}
  );

  const schemaToSql = useCallback(async () => {
    const response: string = await getSchemaToSql({ schema: prismaSchema });
  }, [getSchemaToSql, prismaSchema]);

  const { mutateAsync: dmmfToSchemaMutate } =
    api.dmmf.dmmfToPrismaSchema.useMutation();

  // const { error: dmmfToSchemaError, trigger: getDmmfToSchema } = useSWRMutation(
  //   "/api/dmmfToPrismaSchema",
  //   mutator,
  //   {}
  // );

  const dmmfToSchema = useCallback(async () => {
    console.log("ran: dmmfToSchema");

    if (typeof dmmf === "undefined" || allowParsing) return;
    const response: string = await dmmfToSchemaMutate({ dmmf, config });
    if (response) setPrismaSchema(response);
  }, [dmmf, allowParsing, dmmfToSchemaMutate, config, setPrismaSchema]);

  useDebounce(dmmfToSchema, PARSE_DELAY, [dmmf]);

  const { mutateAsync: schemaToDmmfMutate, data: schemaToDmmfData } =
    api.dmmf.schemaToDmmf.useMutation();

  const schemaErrors: SchemaError[] = useMemo(
    () => schemaToDmmfData?.errors || [],
    [schemaToDmmfData?.errors]
  );

  useEffect(() => {
    console.log("ran: useEffect, monaco");

    if (!monaco) return;
    const markers = schemaErrors.map<editor.IMarkerData>((err) => ({
      message: err.reason,
      startLineNumber: Number(err.row),
      endLineNumber: Number(err.row),
      startColumn: 0,
      endColumn: 9999,
      severity: 8,
    }));

    const [model] = monaco.editor.getModels();
    if (model) monaco.editor.setModelMarkers(model, "prisma-editor", markers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaErrors]);

  const parse = useCallback(async () => {
    console.log("ran: parse");

    if (allowParsing === false) return;
    const response = await schemaToDmmfMutate(prismaSchema);

    if (response.datamodel) {
      setDmmf(response.datamodel);
      setConfig(response.config);
    }
  }, [allowParsing, schemaToDmmfMutate, prismaSchema, setDmmf, setConfig]);

  useDebounce(parse, PARSE_DELAY, [prismaSchema]);

  const resetLayout = useCallback(async () => {
    console.log("ran: resetLayout");

    const layout = await autoLayout(nodes, edges);
    setLayout(layout);
    const { nodes: newNodes, edges: newEdges } = dmmf
      ? dmmfToElements(dmmf, layout)
      : ({ nodes: [], edges: [] } as DMMFToElementsResult);

    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodes, edges, setLayout, dmmf, setNodes, setEdges]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodes) => applyNodeChanges(changes, nodes as any) as any),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setNodes((edges) => applyEdgeChanges(changes, edges as any) as any),
    [setNodes]
  );

  const addField = useCallback(
    (model: string, field: addFieldProps) => {
      console.log("ran: addField");

      setAllowParsing(false);
      const newDmmf = { ...dmmf };
      const modelIndex =
        newDmmf.models?.findIndex((m) => m.name === model) ?? -1;
      if (modelIndex === -1) return;

      const fieldIndex = newDmmf.models![modelIndex]?.fields.findIndex(
        (f) => f.name === field.name
      );
      if (fieldIndex !== -1) return;

      newDmmf.models![modelIndex]?.fields.push({
        name: field.name,
        kind: "scalar",
        isList: false,
        isRequired: true,
        isUnique: false,
        isId: false,
        isReadOnly: false,
        hasDefaultValue: false,
        type: "String",
        isGenerated: false,
        isUpdatedAt: false,
      });

      setDmmf(newDmmf as DMMF.Datamodel);
    },
    [dmmf, setAllowParsing, setDmmf]
  );

  return {
    prismaSchema,
    dmmf,
    nodes,
    edges,
    schemaErrors,
    parse,
    setPrismaSchema: setSchema,
    setNodes,
    resetLayout,
    onNodesChange,
    onEdgesChange,
    dmmfToSchema,
    schemaToSql,
    addField,
  };
};
