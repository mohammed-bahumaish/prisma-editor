/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ElkNode } from "elkjs";
import { type Edge, type Node } from "reactflow";
import {
  type EnumNodeData,
  type DMMFToElementsResult,
  type ModelNodeData,
  type RelationType,
} from "./types";
import { getHandleId } from "~/components/diagram/util/util";
import { type DMMF } from "@prisma-editor/prisma-dmmf-extended";

type FieldWithTable = DMMF.Field & { tableName: string };
interface Relation {
  type: RelationType;
  fields: readonly FieldWithTable[];
}

const generateEnumNode = (
  { name, dbName, documentation, values }: DMMF.DatamodelEnum,
  layout: ElkNode | null
): Node<EnumNodeData> => {
  const positionedNode = layout?.children?.find(
    (layoutNode) => layoutNode.id === name
  );
  return {
    id: name,
    type: "enum",
    position: { x: positionedNode?.x || 0, y: positionedNode?.y || 0 },
    data: {
      type: "enum",
      name,
      dbName,
      documentation,
      values: values.map(({ name }) => name),
    },
  };
};

const generateModelNode = (
  { name, dbName, documentation, fields }: DMMF.Model,
  relations: Readonly<Record<string, Relation>>,
  layout: ElkNode | null
): Node<ModelNodeData> => {
  const positionedNode = layout?.children?.find(
    (layoutNode) => layoutNode.id === name
  );

  const foreignKeys: Array<string> = [];

  return {
    id: name,
    type: "model",
    position: { x: positionedNode?.x || 250, y: positionedNode?.y || 25 },
    data: {
      type: "model",
      name,
      dbName,
      documentation,
      columns: fields
        .flatMap(
          ({
            name,
            type,
            kind,
            documentation,
            isList,
            isUpdatedAt,
            relationName,
            relationFromFields,
            relationToFields,
            isRequired,
            hasDefaultValue,
            default: def,
            isUnique,
            isId,
            isReadOnly,
            native,
          }) => {
            if ((kind as any) === "comment") return [];

            if (relationFromFields?.length)
              foreignKeys.push(...relationFromFields);

            return [
              {
                name,
                kind,
                documentation,
                isList,
                isRequired,
                relationName,
                relationFromFields,
                relationToFields,
                isUnique,
                isId,
                isReadOnly,
                isUpdatedAt,
                hasDefaultValue,
                type,
                native,
                relationType: (
                  (relationName && relations[relationName]) as
                    | Relation
                    | undefined
                )?.type,
                displayType: type + (isList ? "[]" : !isRequired ? "?" : ""),
                default: isUpdatedAt
                  ? "updatedAt()"
                  : !hasDefaultValue || def === undefined
                  ? null
                  : typeof def === "object" && "name" in def
                  ? `${def.name}(${def.args
                      .map((arg) => JSON.stringify(arg))
                      .join(",")})`
                  : kind === "enum"
                  ? def.toString()
                  : JSON.stringify(def),
              },
            ];
          }
        )
        .filter((f) => !foreignKeys.includes(f.name)),
    },
  };
};

const generateEnumEdge = (col: FieldWithTable): Edge => {
  return {
    id: `enum-${col.type}-to-${col.tableName}`,
    source: col.type,
    target: col.tableName,
    type: "relation",
    sourceHandle: col.type + "-handle",
    targetHandle: `${getHandleId({
      modelName: col.tableName,
      fieldName: col.name,
    })}`,
  };
};

const generateRelationEdge = ([relationName, { type, fields }]: [
  string,
  Relation
]): Edge[] => {
  const base = {
    id: `e${relationName}`,
    type: "relation",
    label: relationName,
    data: { relationType: type },
  };

  if (["1-n", "m-n"].includes(type)) {
    const source = fields.find((x) => x.isList)!;
    const target = (fields.find((x) => !x.isList) || fields[1])!;

    return [
      {
        ...base,
        source: source.tableName,
        target: source.type,
        sourceHandle: getHandleId({
          modelName: source.tableName,
          fieldName: source.name,
        }),
        targetHandle: getHandleId({
          modelName: target.tableName,
          fieldName: target.name,
        }),
      },
    ];
  } else {
    const source = fields[0]!;
    const target = fields[1]!;
    return [
      {
        ...base,
        source: source.tableName,
        target: source.type,

        sourceHandle: getHandleId({
          modelName: source.tableName,
          fieldName: source.name,
        }),
        targetHandle: getHandleId({
          modelName: source.type,
          fieldName: target.name,
        }),
      },
    ];
  }
};

export const dmmfToElements = (
  data: DMMF.Datamodel,
  layout: ElkNode | null
): DMMFToElementsResult => {
  const filterFields = (kind: DMMF.FieldKind) =>
    data.models.flatMap(({ name: tableName, fields }) =>
      fields
        .filter((col) => col.kind === kind)
        .map((col) => ({ ...col, tableName }))
    );

  const relationFields = filterFields("object");
  const enumFields = filterFields("enum");

  const groupedByRelationName: Readonly<
    Record<string, readonly FieldWithTable[]>
  > = relationFields.reduce((p, c) => {
    const relationName = c.relationName!;
    if (!p[relationName]) {
      p[relationName] = [];
    }
    return { ...p, [relationName]: [...p[relationName], c] };
  }, {} as { [key: string]: any });

  const groupedByRelationNameAndRelationType: ReadonlyArray<
    [string, Relation]
  > = Object.entries(groupedByRelationName).map(([key, [one, two]]) => {
    if (one?.isList && two?.isList)
      return [key, { type: "m-n", fields: [one, two] }];
    else if (one?.isList || two?.isList)
      return [key, { type: "1-n", fields: [one!, two!] }];
    else return [key, { type: "1-1", fields: [one!, two!] }];
  });

  const relations: Readonly<Record<string, Relation>> = Object.fromEntries(
    groupedByRelationNameAndRelationType
  );

  const x = {
    nodes: [
      ...data.enums.map((enumData) => generateEnumNode(enumData, layout)),
      ...[...data.models].map((model) =>
        generateModelNode(model, relations, layout)
      ),
    ],
    edges: [
      ...enumFields.map(generateEnumEdge),
      ...Object.entries(relations).flatMap(generateRelationEdge),
    ],
  };
  return x;
};
