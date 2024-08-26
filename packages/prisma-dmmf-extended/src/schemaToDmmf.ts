import { type DMMF } from "@prisma/generator-helper";
import { getConfig, getDMMF } from "@prisma/internals";
import { processLine } from "./processLine";
import { handleError } from "./handleError";

export const schemaToDmmf = async (schema: string) => {
  try {
    const { datamodel, config } = await processSchema(schema);
    return { datamodel, config };
  } catch (error) {
    try {
      const { datamodel, config } = await processSchema(
        removeZenStackSyntax(schema)
      );
      return { datamodel, config };
    } catch (error) {
      return handleError(error as Error);
    }
  }
};

function removeZenStackSyntax(schema: string): string {
  // Remove import statements
  schema = schema.replace(/^import\s+.*$/gm, " ");

  // Replace ZenStack plugin blocks with empty lines
  schema = schema.replace(/plugin\s+\w+\s*{[^}]*}/gs, (match) => {
    // Count the number of newlines in the matched text
    const lineCount = (match.match(/\n/g) || []).length;
    // Return an equivalent number of newlines
    return "\n".repeat(lineCount);
  });
  // Remove @email, @omit, @password attributes
  schema = schema.replace(/@(email|omit|password)(\(.+?\))?/g, " ");

  // Remove @@allow statements
  schema = schema
    .split("\n")
    .map((line) => {
      if (line.includes("@@allow")) {
        return " ";
      }
      return line;
    })
    .join("\n");

  // Replace models that use extends syntax with empty lines
  schema = schema.replace(
    /model\s+\w+\s+extends\s+\w+\s*{[^}]*}/gs,
    (match) => {
      const lineCount = (match.match(/\n/g) || []).length;
      return "\n".repeat(lineCount);
    }
  );

  // Remove auth() function calls
  schema = schema.replace(/auth\(\)/g, " ");

  // Remove @use statements
  schema = schema.replace(/@use\(.+?\)/g, " ");

  // Remove @relation.fields and @relation.references
  schema = schema.replace(/@relation\.(fields|references)/g, " ");

  // Remove @default(cuid()) and replace with @default(uuid())
  schema = schema.replace(/@default\(cuid\(\)\)/g, "@default(uuid())");

  // Remove @(...) attributes that are not standard Prisma attributes
  // This regex excludes common Prisma attributes
  schema = schema.replace(
    /@(?!id|default|unique|relation|updatedAt|map)[\w.]+(\(.+?\))?/g,
    " "
  );

  // Remove empty lines and trim whitespace
  schema = schema
    .split("\n")
    .filter((line) => line.trim() !== " ")
    .join("\n");

  return schema;
}

async function processSchema(schema: string) {
  const { datamodel: originalDatamodel } = await getDMMF({ datamodel: schema });
  const config = await getConfig({
    datamodel: schema,
    ignoreEnvVarErrors: true,
  });
  const lines = schema.split("\n");
  const datamodel = JSON.parse(
    JSON.stringify(originalDatamodel)
  ) as DMMF.Datamodel;

  let currentModel: (DMMF.Model & { endComments?: string[] }) | undefined;
  let startComments: string[] = [];

  lines.forEach((line, index) => {
    const result = processLine(
      line,
      index,
      datamodel,
      currentModel,
      startComments,
      lines
    );
    currentModel = result.currentModel;
    const currentModelIndex = datamodel.models.findIndex(
      (m) => m.name === currentModel?.name
    );
    if (currentModelIndex !== -1 && currentModel) {
      datamodel.models[currentModelIndex] = currentModel;
    }
    startComments = result.startComments;
  });

  if (startComments.length > 0 && currentModel) {
    currentModel.endComments = [...startComments];
  }

  return { datamodel, config };
}
