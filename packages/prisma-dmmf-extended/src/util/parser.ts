import {
  ConnectorType,
  DataSource,
  DMMF,
  EnvValue,
  GeneratorConfig,
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
}

const handlers = (type: string, kind: DMMF.FieldKind) => {
  return {
    default: (value: unknown) => {
      if (kind === "enum") {
        return `@default(${value})`;
      }

      if (type === "Boolean") {
        return `@default(${value})`;
      }

      if (typeof value === "undefined" || value === null) {
        return "";
      }

      if (typeof value === "object") {
        // @ts-ignore
        return `@default(${value.name}(${value.args}))`;
      }

      if (typeof value === "number") {
        return `@default(${value})`;
      }

      if (typeof value === "string") {
        return `@default("${value}")`;
      }

      throw new Error(`Unsupported field attribute ${value}`);
    },
    isId: (value: string) => (value ? "@id" : ""),
    isUnique: (value: string) => (value ? "@unique" : ""),
    dbNames: (value: string) => {},
    dbName: (value: string) => (value ? `@map("${value}")` : ""),
    native: (value: string) => (value ? `${value}` : ""),
    relationToFields: (value: string) => {},
    relationOnDelete: (value: string) => {},
    hasDefaultValue: (value: string) => {},
    relationName: (value: string) => {},
    documentation: (value: string) => {},
    isReadOnly: (value: string) => {},
    isGenerated: (value: string) => {},
    isUpdatedAt: (value: string) => (value ? "@updatedAt" : ""),
    columnName: (value: string) => (value ? `@map("${value}")` : ""),
    comment: (value: string) => (value ? `//${value}` : ""),
  };
};

function handleAttributes(
  attributes: Attribute,
  kind: DMMF.FieldKind,
  type: string
) {
  const { relationFromFields, relationToFields, relationName } = attributes;
  if (kind === "scalar") {
    return `${Object.keys(attributes)
      // @ts-ignore
      .map((each) => handlers(type, kind)[each](attributes[each]))
      .join(" ")}`;
  }

  if (kind === "object" && relationFromFields) {
    return relationFromFields.length > 0
      ? `@relation(name: "${relationName}", fields: [${relationFromFields}], references: [${relationToFields}])`
      : `@relation(name: "${relationName}") ${
          attributes?.comment ? "//" + attributes.comment : ""
        }`;
  }

  if (kind === "enum")
    return `${Object.keys(attributes)
      // @ts-ignore
      .map((each) => handlers(type, kind)[each](attributes[each]))
      .join(" ")}`;

  return "";
}

function handleFields(fields: Field[]) {
  return fields
    .map((fields) => {
      const { name, kind, type, isRequired, isList, ...attributes } = fields;
      if (kind === "scalar") {
        return `  ${name} ${type}${
          isList ? "[]" : isRequired ? "" : "?"
        } ${handleAttributes(attributes, kind, type)}`;
      }

      if (kind === "object") {
        return `  ${name} ${type}${
          isList ? "[]" : isRequired ? "" : "?"
        } ${handleAttributes(attributes, kind, type)}`;
      }

      if (kind === "enum") {
        return `  ${name} ${type}${
          isList ? "[]" : isRequired ? "" : "?"
        } ${handleAttributes(attributes, kind, type)}`;
      }
      if ((kind as any) === "comment") {
        return `//${name}`;
      }

      throw new Error(`Unsupported field kind "${kind}"`);
    })
    .join("\n");
}

function handleIdFields(idFields: string[]) {
  return idFields && idFields.length > 0
    ? `@@id([${idFields.join(", ")}])`
    : "";
}

function handleUniqueFieds(uniqueFields: string[][]) {
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
  const { name, uniqueFields, dbName, idFields, index } = model;
  const fields = model.fields as unknown as Field[];

  const output = `
model ${name} {
${handleFields(fields)}
${handleUniqueFieds(uniqueFields)}
${handleDbName(dbName)}
${handleIdFields(idFields)}
${index || ""}
}`;
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

export async function dmmfModelsdeserializer(models: Model[]) {
  return models.map((model) => deserializeModel(model)).join("\n");
}

export async function datasourcesDeserializer(datasources: DataSource[]) {
  return datasources
    .map((datasource) => deserializeDatasource(datasource))
    .join("\n");
}

export async function generatorsDeserializer(generators: GeneratorConfig[]) {
  return generators
    .map((generator) => printGeneratorConfig(generator))
    .join("\n");
}

export async function dmmfEnumsDeserializer(enums: DMMF.DatamodelEnum[]) {
  return enums.map((each) => deserializeEnum(each)).join("\n");
}
