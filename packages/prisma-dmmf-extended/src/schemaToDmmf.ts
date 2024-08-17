import { type DMMF } from "@prisma/generator-helper";
import { getConfig, getDMMF } from "@prisma/internals";
import { processLine } from "./processLine";
import { handleError } from "./handleError";

export const schemaToDmmf = async (schema: string) => {
  try {
    const { datamodel, config } = await processSchema(schema);
    return { datamodel, config };
  } catch (error) {
    return handleError(error as Error);
  }
};

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
