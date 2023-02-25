// src/util/parser.ts
import { printGeneratorConfig } from "@prisma/engine-core";
var handlers = (type, kind) => {
  return {
    default: (value) => {
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
    isId: (value) => value ? "@id" : "",
    isUnique: (value) => value ? "@unique" : "",
    dbNames: (value) => {
    },
    dbName: (value) => value ? `@map("${value}")` : "",
    native: (value) => value ? `${value}` : "",
    relationToFields: (value) => {
    },
    relationOnDelete: (value) => {
    },
    hasDefaultValue: (value) => {
    },
    relationName: (value) => {
    },
    documentation: (value) => {
    },
    isReadOnly: (value) => {
    },
    isGenerated: (value) => {
    },
    isUpdatedAt: (value) => value ? "@updatedAt" : "",
    columnName: (value) => value ? `@map("${value}")` : "",
    comment: (value) => value ? `//${value}` : ""
  };
};
function handleAttributes(attributes, kind, type) {
  const { relationFromFields, relationToFields, relationName } = attributes;
  if (kind === "scalar") {
    return `${Object.keys(attributes).map((each) => handlers(type, kind)[each](attributes[each])).join(" ")}`;
  }
  if (kind === "object" && relationFromFields) {
    return relationFromFields.length > 0 ? `@relation(name: "${relationName}", fields: [${relationFromFields}], references: [${relationToFields}])` : `@relation(name: "${relationName}") ${(attributes == null ? void 0 : attributes.comment) ? "//" + attributes.comment : ""}`;
  }
  if (kind === "enum")
    return `${Object.keys(attributes).map((each) => handlers(type, kind)[each](attributes[each])).join(" ")}`;
  return "";
}
function handleFields(fields) {
  return fields.map((fields2) => {
    const { name, kind, type, isRequired, isList, ...attributes } = fields2;
    if (kind === "scalar") {
      return `  ${name} ${type}${isList ? "[]" : isRequired ? "" : "?"} ${handleAttributes(attributes, kind, type)}`;
    }
    if (kind === "object") {
      return `  ${name} ${type}${isList ? "[]" : isRequired ? "" : "?"} ${handleAttributes(attributes, kind, type)}`;
    }
    if (kind === "enum") {
      return `  ${name} ${type}${isList ? "[]" : isRequired ? "" : "?"} ${handleAttributes(attributes, kind, type)}`;
    }
    if (kind === "comment") {
      return `//${name}`;
    }
    throw new Error(`Unsupported field kind "${kind}"`);
  }).join("\n");
}
function handleIdFields(idFields) {
  return idFields && idFields.length > 0 ? `@@id([${idFields.join(", ")}])` : "";
}
function handleUniqueFieds(uniqueFields) {
  return uniqueFields.length > 0 ? uniqueFields.map((eachUniqueField) => `@@unique([${eachUniqueField.join(", ")}])`).join("\n") : "";
}
function handleDbName(dbName) {
  return dbName ? `@@map("${dbName}")` : "";
}
function handleUrl(envValue) {
  const value = envValue.fromEnvVar ? `env("${envValue.fromEnvVar}")` : envValue.value;
  return `url = ${value}`;
}
function handleProvider(provider) {
  return `provider = "${provider}"`;
}
function deserializeModel(model) {
  const { name, uniqueFields, dbName, idFields, index } = model;
  const fields = model.fields;
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
function deserializeDatasource(datasource) {
  const { activeProvider: provider, name, url } = datasource;
  return `
datasource ${name} {
	${handleProvider(provider)}
	${handleUrl(url)}
}`;
}
function deserializeEnum({ name, values, dbName }) {
  const outputValues = values.map(({ name: name2, dbName: dbName2 }) => {
    let result = name2;
    if (name2 !== dbName2 && dbName2)
      result += `@map("${dbName2}")`;
    return result;
  });
  return `
enum ${name} {
	${outputValues.join("\n	")}
	${handleDbName(dbName || null)}
}`;
}
async function dmmfModelsdeserializer(models) {
  return models.map((model) => deserializeModel(model)).join("\n");
}
async function datasourcesDeserializer(datasources) {
  return datasources.map((datasource) => deserializeDatasource(datasource)).join("\n");
}
async function generatorsDeserializer(generators) {
  return generators.map((generator) => printGeneratorConfig(generator)).join("\n");
}
async function dmmfEnumsDeserializer(enums) {
  return enums.map((each) => deserializeEnum(each)).join("\n");
}

// src/dmmfToSchema.ts
import { formatSchema } from "@prisma/internals";
var dmmfToSchema = async ({
  dmmf: { models, enums },
  config: { datasources, generators }
}) => {
  const outputSchema = [
    await datasourcesDeserializer(datasources),
    await generatorsDeserializer(generators),
    await dmmfModelsdeserializer(models),
    await dmmfEnumsDeserializer(enums)
  ].filter((e) => e).join("\n\n\n");
  return await formatSchema({ schema: outputSchema });
};

// src/schemaToDmmf.ts
import { getConfig, getDMMF } from "@prisma/internals";
import stripAnsi from "strip-ansi";
var ErrorTypes = /* @__PURE__ */ ((ErrorTypes2) => {
  ErrorTypes2[ErrorTypes2["Prisma"] = 0] = "Prisma";
  ErrorTypes2[ErrorTypes2["Other"] = 1] = "Other";
  return ErrorTypes2;
})(ErrorTypes || {});
var schemaToDmmf = async (schema) => {
  try {
    const { datamodel } = await getDMMF({
      datamodel: schema
    });
    const config = await getConfig({
      datamodel: schema,
      ignoreEnvVarErrors: true
    });
    const lines = schema.split("\n");
    let model = "";
    lines.forEach((line, index) => {
      if (line.includes("model"))
        model = line.trim().split(" ")[1];
      if (line.includes("@db")) {
        const lineWords = line.trim().split(" ");
        const field = lineWords[0];
        const nativeAttribute = lineWords[2];
        const dmmfModel = datamodel.models.find((m) => m.name === model);
        const dmmfField = dmmfModel == null ? void 0 : dmmfModel.fields.find((f) => f.name === field);
        if (dmmfField)
          dmmfField["native"] = nativeAttribute;
      }
      if (line.includes("//")) {
        const dmmfModel = datamodel.models.find((m) => m.name === model);
        const lineWords = line.trim().split(" ");
        const comment = line.trim().split("//")[1];
        const isCommentLine = lineWords[0].includes("//");
        if (!isCommentLine) {
          const field = lineWords[0];
          const dmmfField = dmmfModel == null ? void 0 : dmmfModel.fields.find((f) => f.name === field);
          if (dmmfField)
            dmmfField["comment"] = comment;
        } else {
          const lastLine = lines[index - 1];
          const lineWords2 = lastLine.trim().split(" ");
          const field = lineWords2[0];
          if (field === "model") {
            dmmfModel == null ? void 0 : dmmfModel.fields.unshift({
              kind: "comment",
              name: comment
            });
          } else {
            const dmmfFieldIndex = dmmfModel == null ? void 0 : dmmfModel.fields.findIndex(
              (f) => f.name === field
            );
            if (dmmfFieldIndex)
              dmmfModel == null ? void 0 : dmmfModel.fields.splice(dmmfFieldIndex + 1, 0, {
                kind: "comment",
                name: comment
              });
          }
        }
      }
      if (line.includes("@@index")) {
        const index2 = line.trim();
        const dmmfModel = datamodel.models.find((m) => m.name === model);
        if (dmmfModel)
          dmmfModel["index"] = index2;
      }
    });
    return { datamodel, config };
  } catch (error) {
    const message = stripAnsi(error.message);
    let errors;
    let errType;
    if (message.includes("error: ")) {
      errors = parseDMMFError(message);
      errType = 0 /* Prisma */;
    } else {
      console.error(error);
      errors = message;
      errType = 1 /* Other */;
    }
    return { errors, type: errType };
  }
};
var errRegex = /^(?:Error validating.*?:)?(.+?)\n  -->  schema\.prisma:(\d+)\n/;
var parseDMMFError = (error) => error.split("error: ").slice(1).map((msg) => msg.match(errRegex).slice(1)).map(([reason, row]) => ({ reason, row }));

// src/index.ts
export * from "@prisma/generator-helper";
export {
  ErrorTypes,
  dmmfToSchema,
  schemaToDmmf
};
//# sourceMappingURL=index.mjs.map