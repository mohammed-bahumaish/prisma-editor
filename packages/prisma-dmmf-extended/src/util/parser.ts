/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  type ConnectorType,
  type DataSource,
  type DMMF,
  type EnvValue,
  type GeneratorConfig,
} from "@prisma/generator-helper";
import { printGeneratorConfig } from "@prisma/engine-core";

export interface Field {
  kind: DMMF.FieldKind;
  name: string;
  isRequired: boolean;
  isList: boolean;
  isUnique: boolean;
  isId: boolean;
  type: string;
  dbNames: string[] | null;
  isGenerated: boolean;
  hasDefaultValue: boolean;
  relationFromFields?: any[];
  relationToFields?: any[];
  relationOnDelete?: string;
  relationName?: string;
  default: boolean | any;
  isUpdatedAt: boolean;
  isReadOnly: string;
  columnName?: string;
}

export interface Attribute {
  isUnique: boolean;
  isId: boolean;
  dbNames: string[] | null;
  relationFromFields?: any[];
  relationToFields?: any[];
  relationOnDelete?: string;
  relationName?: string;
  isReadOnly: string;
  default?: boolean | any;
  isGenerated: boolean;
  isUpdatedAt: boolean;
  columnName?: string;
  comment?: string;
}

export interface Model extends DMMF.Model {
  uniqueFields: string[][];
  startComments?: string[];
  endComments?: string[];
  idFields?: string[];
}

type AttributeHandler = (value: unknown, kind: DMMF.FieldKind) => string;

const attributeHandlers: Record<string, AttributeHandler> = {
  default: (value: unknown, kind: DMMF.FieldKind) => {
    if (
      kind === "enum" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return `@default(${value})`;
    }
    if (typeof value === "string") {
      return `@default("${value}")`;
    }
    if (typeof value === "object") {
      // ex. { name: 'autoincrement', args: [] } -> @default(autoincrement())
      const defaultObject = value as { name: string; args: string };
      return `@default(${defaultObject.name}(${defaultObject.args}))`;
    }
    return "";
  },
  isId: (value: unknown) => (value ? "@id" : ""),
  isUnique: (value: unknown) => (value ? "@unique" : ""),
  native: (value: unknown) => (value ? `${value}` : ""),
  isUpdatedAt: (value: unknown) => (value ? "@updatedAt" : ""),
  dbName: (value: unknown) => (value ? `@map("${value}")` : ""),
  columnName: (value: unknown) => (value ? `@map("${value}")` : ""),
  comment: (value: unknown) => (value ? `//${value}` : ""),
};

function handleAttributes(attributes: Attribute, kind: DMMF.FieldKind) {
  const { relationFromFields, relationToFields, relationName } = attributes;

  if (kind === "object" && relationFromFields) {
    return relationFromFields.length > 0
      ? `@relation(name: "${relationName}", fields: [${relationFromFields}], references: [${relationToFields}])`
      : `@relation(name: "${relationName}") ${
          attributes?.comment ? "//" + attributes.comment : ""
        }`;
  }

  return Object.entries(attributes)
    .map(([key, value]) => attributeHandlers[key]?.(value, kind) ?? "")
    .join(" ");
}

function handleFields(fields: Field[]) {
  return fields
    .map((fields) => {
      const { name, kind, type, isRequired, isList, ...attributes } = fields;
      if ((kind as any) === "comment") {
        return `//${name}`;
      }

      const fieldAttributes = handleAttributes(attributes, kind);
      return `${name} ${type}${
        isList ? "[]" : isRequired ? "" : "?"
      } ${fieldAttributes}`;
    })
    .join("\n");
}

function handleIdFields(idFields?: string[]) {
  if (!idFields || idFields.length === 0) return "";
  return `@@id([${idFields.join(", ")}])`;
}

function handleUniqueFields(uniqueFields: string[][]) {
  return uniqueFields.length > 0
    ? uniqueFields
        .map((eachUniqueField) => `@@unique([${eachUniqueField.join(", ")}])`)
        .join("\n")
    : "";
}

function handleDbName(dbName: string | null) {
  return dbName ? `@@map("${dbName}")` : "";
}

function handleUrl(envValue: EnvValue) {
  const value = envValue.fromEnvVar
    ? `env("${envValue.fromEnvVar}")`
    : envValue.value;

  return `url = ${value}`;
}

function handleProvider(provider: ConnectorType | string) {
  return `provider = "${provider}"`;
}

function deserializeModel(model: Model) {
  const {
    name,
    uniqueFields,
    dbName,
    idFields,
    index,
    startComments = [],
    endComments = [],
  } = model;
  const indexs = index as string[];
  const fields = model.fields as unknown as Field[];

  const output = `
${startComments.map((c) => "// " + c).join("\n")}

model ${name} {
${handleFields(fields)}
${handleUniqueFields(uniqueFields)}
${handleDbName(dbName)}
${handleIdFields(idFields)}
${indexs?.join("\n") || ""}
}

${endComments.map((c) => "// " + c).join("\n")}
`;
  return output;
}

function deserializeDatasource(datasource: DataSource) {
  const { activeProvider: provider, name, url } = datasource;

  return `
datasource ${name} {
	${handleProvider(provider)}
	${handleUrl(url)}
}`;
}

function deserializeEnum({ name, values, dbName }: DMMF.DatamodelEnum) {
  const outputValues = values.map(({ name, dbName }) => {
    let result = name;
    if (name !== dbName && dbName) result += `@map("${dbName}")`;
    return result;
  });
  return `
enum ${name} {
	${outputValues.join("\n\t")}
	${handleDbName(dbName || null)}
}`;
}

export function dmmfModelsdeserializer(models: Model[]) {
  return models.map((model) => deserializeModel(model)).join("\n");
}

export function datasourcesDeserializer(datasources: DataSource[]) {
  return datasources
    .map((datasource) => deserializeDatasource(datasource))
    .join("\n");
}

export function generatorsDeserializer(generators: GeneratorConfig[]) {
  return generators
    .map((generator) => printGeneratorConfig(generator))
    .join("\n");
}

export function dmmfEnumsDeserializer(enums: DMMF.DatamodelEnum[]) {
  return enums.map((each) => deserializeEnum(each)).join("\n");
}
